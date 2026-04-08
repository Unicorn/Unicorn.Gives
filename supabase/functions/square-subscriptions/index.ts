/**
 * Square Subscriptions Edge Function
 *
 * POST { action: 'list_plans', partner_id }                    — anonymous
 * POST { action: 'create_checkout', partner_id, plan_variation_id, tier?, redirect_url? }
 *      — REQUIRES Authorization: Bearer <user jwt>. Customer info is pulled
 *        from the authenticated profile; no arbitrary email accepted.
 *
 * Deploy: `supabase functions deploy square-subscriptions`
 * Config: `[functions.square-subscriptions] verify_jwt = false` in config.toml
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { corsHeaders, json } from '../_shared/cors.ts';
import { getDecryptedToken, squareFetch } from '../_shared/square.ts';

const rateState = new Map<string, number>();
const RATE_LIMIT_MS = 500;

type ListPlansRequest = {
  action: 'list_plans';
  partner_id: string;
};

type CreateCheckoutRequest = {
  action: 'create_checkout';
  partner_id: string;
  plan_variation_id: string;
  tier?: 'individual' | 'couple' | 'family';
  redirect_url?: string;
};

type SubscriptionsRequest = ListPlansRequest | CreateCheckoutRequest;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const now = Date.now();
    const lastRequest = rateState.get(ip) ?? 0;
    if (now - lastRequest < RATE_LIMIT_MS) {
      return json({ error: 'Too many requests' }, 429);
    }
    rateState.set(ip, now);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey);

    let body: SubscriptionsRequest;
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    // Verify subscriptions are enabled
    const { data: config } = await admin
      .from('square_feature_config')
      .select('subscriptions_enabled')
      .eq('partner_id', body.partner_id)
      .single();

    if (!config?.subscriptions_enabled) {
      return json({ error: 'Subscriptions not enabled for this partner' }, 403);
    }

    // ── list_plans: read from cache, no Square call needed ──
    if (body.action === 'list_plans') {
      const { data: plans } = await admin
        .from('square_catalog_cache')
        .select('id, square_id, display_name, display_order, data')
        .eq('partner_id', body.partner_id)
        .eq('data_type', 'subscription_plan')
        .eq('is_active', true)
        .order('display_order');
      return json({ plans: plans ?? [] });
    }

    if (body.action !== 'create_checkout') {
      return json({ error: 'Unknown action' }, 400);
    }

    // ── create_checkout: require authenticated user ──
    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
    if (!jwt) {
      return json({ error: 'Sign in required to subscribe' }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes.user) {
      return json({ error: 'Invalid session' }, 401);
    }
    const authUser = userRes.user;

    const { data: profile } = await admin
      .from('profiles')
      .select('id, email, display_name')
      .eq('id', authUser.id)
      .single();

    if (!profile) {
      return json({ error: 'Profile not found' }, 404);
    }

    const email = profile.email ?? authUser.email ?? '';
    const displayName = (profile.display_name ?? '').trim();
    const [givenName, ...rest] = displayName.split(/\s+/);
    const familyName = rest.join(' ');

    const { data: conn } = await admin
      .from('square_connections')
      .select('access_token, location_id, merchant_id')
      .eq('partner_id', body.partner_id)
      .single();

    if (!conn || !conn.location_id) {
      return json({ error: 'No Square connection for this partner' }, 404);
    }

    const accessToken = await getDecryptedToken(conn.access_token);
    const locationId = conn.location_id;

    // Look up the plan variation to extract the first-phase price.
    const { data: planRow } = await admin
      .from('square_catalog_cache')
      .select('data, display_name')
      .eq('partner_id', body.partner_id)
      .eq('data_type', 'subscription_plan')
      .eq('square_id', body.plan_variation_id)
      .single();

    if (!planRow) {
      return json({ error: 'Plan variation not found. Sync Square catalog first.' }, 404);
    }

    const planData = planRow.data as {
      subscription_plan_variation_data?: {
        name?: string;
        phases?: Array<{
          pricing?: { price?: { amount?: number; currency?: string } };
        }>;
      };
    };
    const firstPhase = planData.subscription_plan_variation_data?.phases?.[0];
    const price = firstPhase?.pricing?.price;
    if (!price?.amount) {
      return json({ error: 'Plan variation has no price configured in Square' }, 400);
    }

    // Reuse existing Square customer if we already have one for this user+partner.
    let squareCustomerId: string | undefined;
    const { data: existingCustomer } = await admin
      .from('square_customers')
      .select('square_customer_id')
      .eq('user_id', authUser.id)
      .eq('partner_id', body.partner_id)
      .maybeSingle();

    if (existingCustomer?.square_customer_id) {
      squareCustomerId = existingCustomer.square_customer_id;
    } else {
      try {
        const customerRes = await squareFetch('/v2/customers', accessToken, {
          method: 'POST',
          body: JSON.stringify({
            idempotency_key: crypto.randomUUID(),
            given_name: givenName || email.split('@')[0],
            family_name: familyName || undefined,
            email_address: email,
            reference_id: authUser.id,
            note: `unicorn_user_id=${authUser.id}`,
          }),
        });
        if (customerRes.ok) {
          const cd = await customerRes.json() as { customer?: { id: string } };
          squareCustomerId = cd.customer?.id;

          if (squareCustomerId) {
            await admin.from('square_customers').upsert({
              user_id: authUser.id,
              partner_id: body.partner_id,
              square_customer_id: squareCustomerId,
              email,
              given_name: givenName || null,
              family_name: familyName || null,
              raw: cd.customer ?? {},
              synced_at: new Date().toISOString(),
            }, { onConflict: 'partner_id,square_customer_id' });
          }
        }
      } catch (e) {
        console.warn('Customer creation failed (non-fatal):', e);
      }
    }

    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://unicorn.gives';
    const redirectUrl = body.redirect_url ?? `${siteUrl}/user/account/subscriptions?status=success`;

    const linkBody = {
      idempotency_key: crypto.randomUUID(),
      quick_pay: {
        name: planData.subscription_plan_variation_data?.name ?? 'Membership',
        price_money: {
          amount: price.amount,
          currency: price.currency ?? 'USD',
        },
        location_id: locationId,
      },
      checkout_options: {
        ask_for_shipping_address: false,
        accepted_payment_methods: {
          apple_pay: true,
          google_pay: true,
          cash_app_pay: true,
          afterpay_clearpay: false,
        },
        redirect_url: redirectUrl,
        enable_coupon: false,
        enable_loyalty: false,
      },
      pre_populated_data: {
        buyer_email: email,
      },
    };

    const linkRes = await squareFetch('/v2/online-checkout/payment-links', accessToken, {
      method: 'POST',
      body: JSON.stringify(linkBody),
    });

    if (!linkRes.ok) {
      const errText = await linkRes.text();
      console.error('Payment link creation failed:', errText);
      return json({ error: 'Failed to create checkout link', detail: errText.slice(0, 600) }, 502);
    }

    const linkData = await linkRes.json() as {
      payment_link?: { id?: string; url?: string; order_id?: string };
    };

    const checkoutUrl = linkData.payment_link?.url;
    if (!checkoutUrl) {
      return json({ error: 'Square did not return a checkout URL' }, 502);
    }

    await admin.from('square_subscriptions').insert({
      partner_id: body.partner_id,
      user_id: authUser.id,
      square_customer_id: squareCustomerId ?? null,
      plan_variation_id: body.plan_variation_id,
      tier: body.tier ?? null,
      customer_name: displayName || null,
      customer_email: email,
      status: 'pending',
      raw: { payment_link: linkData.payment_link ?? {} },
    });

    return json({ checkout_url: checkoutUrl, payment_link_id: linkData.payment_link?.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    console.error('square-subscriptions error:', msg);
    return json({ error: msg }, 500);
  }
});
