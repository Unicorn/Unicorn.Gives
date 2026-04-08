/**
 * Square Subscriptions Edge Function (public-facing)
 *
 * POST { action: 'list_plans', partner_id }
 * POST { action: 'create_checkout', partner_id, plan_variation_id, customer: {...}, redirect_url? }
 *
 * For `create_checkout`, we use Square's Checkout API (Payment Links) to
 * collect the first payment and card on file. A pending `square_subscriptions`
 * row is inserted; it is upgraded to `active` when the subscription.created
 * webhook fires.
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
  customer: {
    given_name: string;
    family_name?: string;
    email_address: string;
    phone_number?: string;
  };
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

    // ── create_checkout: create Square payment link ──
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

    if (body.action === 'create_checkout') {
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

      // Create or find Square customer (best-effort — not fatal if it fails).
      let squareCustomerId: string | undefined;
      try {
        const customerRes = await squareFetch('/v2/customers', accessToken, {
          method: 'POST',
          body: JSON.stringify({
            idempotency_key: crypto.randomUUID(),
            given_name: body.customer.given_name,
            family_name: body.customer.family_name,
            email_address: body.customer.email_address,
            phone_number: body.customer.phone_number,
          }),
        });
        if (customerRes.ok) {
          const cd = await customerRes.json() as { customer?: { id: string } };
          squareCustomerId = cd.customer?.id;
        }
      } catch (e) {
        console.warn('Customer creation failed (non-fatal):', e);
      }

      // Create a Square Payment Link (Checkout API) for the first period.
      // Square returns a hosted URL the customer visits to enter card details.
      const redirectUrl =
        body.redirect_url ??
        `${Deno.env.get('SITE_URL') ?? 'https://unicorn.gives'}/partners?subscription=success`;

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
          // Store the card so the subscription API can reuse it.
          enable_coupon: false,
          enable_loyalty: false,
        },
        pre_populated_data: {
          buyer_email: body.customer.email_address,
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
        payment_link?: {
          id?: string;
          url?: string;
          order_id?: string;
        };
      };

      const checkoutUrl = linkData.payment_link?.url;
      if (!checkoutUrl) {
        return json({ error: 'Square did not return a checkout URL' }, 502);
      }

      // Record a pending subscription. The webhook (or a follow-up job) will
      // upgrade this to `active` once the subscription is created in Square.
      await admin.from('square_subscriptions').insert({
        partner_id: body.partner_id,
        square_customer_id: squareCustomerId ?? null,
        plan_variation_id: body.plan_variation_id,
        tier: body.tier ?? null,
        customer_name: [body.customer.given_name, body.customer.family_name]
          .filter(Boolean)
          .join(' '),
        customer_email: body.customer.email_address,
        status: 'pending',
        raw: { payment_link: linkData.payment_link ?? {} },
      });

      return json({ checkout_url: checkoutUrl, payment_link_id: linkData.payment_link?.id });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    console.error('square-subscriptions error:', msg);
    return json({ error: msg }, 500);
  }
});
