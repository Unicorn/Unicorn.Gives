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
import { getValidAccessToken, squareFetch } from '../_shared/square.ts';

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

    // Refreshes the token in place if it has expired or is about to.
    const creds = await getValidAccessToken(admin, body.partner_id);
    if (!creds || !creds.locationId) {
      return json({ error: 'No Square connection for this partner' }, 404);
    }
    const { accessToken, locationId } = creds;

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

    // Square Checkout picks (or creates) the subscription's customer itself by
    // matching the buyer's phone number, so we don't pre-create one. A
    // customer we already mapped to this user is still recorded on the
    // pending row as matching evidence.
    const { data: existingCustomer } = await admin
      .from('square_customers')
      .select('square_customer_id')
      .eq('user_id', authUser.id)
      .eq('partner_id', body.partner_id)
      .order('synced_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    const squareCustomerId: string | undefined = existingCustomer?.square_customer_id;

    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://unicorn.gives';
    const redirectUrl = body.redirect_url ?? `${siteUrl}/user/account/subscriptions?status=success`;

    const linkBody = {
      idempotency_key: crypto.randomUUID(),
      quick_pay: {
        name: planData.subscription_plan_variation_data?.name ?? 'Membership',
        // Must match the plan variation's price, or Square treats it as an override.
        price_money: {
          amount: price.amount,
          currency: price.currency ?? 'USD',
        },
        location_id: locationId,
      },
      checkout_options: {
        // A plan *variation* id: this is what makes Square enroll the buyer in
        // a recurring subscription instead of taking a one-time payment.
        subscription_plan_id: body.plan_variation_id,
        ask_for_shipping_address: false,
        // Cash App Pay and Afterpay are not supported for subscriptions.
        accepted_payment_methods: {
          apple_pay: true,
          google_pay: true,
          cash_app_pay: false,
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
      return json({ error: 'Failed to create checkout link' }, 502);
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
      square_order_id: linkData.payment_link?.order_id ?? null,
      square_payment_link_id: linkData.payment_link?.id ?? null,
      raw: { payment_link: linkData.payment_link ?? {} },
    });

    return json({ checkout_url: checkoutUrl, payment_link_id: linkData.payment_link?.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    console.error('square-subscriptions error:', msg);
    return json({ error: msg }, 500);
  }
});
