/**
 * Square Subscriptions Edge Function
 *
 * POST { action: 'list_plans', partner_id }                    — anonymous
 * POST { action: 'create_checkout', partner_id, plan_variation_id, tier?, redirect_url? }
 *      — REQUIRES Authorization: Bearer <user jwt>. Customer info is pulled
 *        from the authenticated profile; no arbitrary email accepted.
 * POST { action: 'membership_options', partner_id }
 *      — public: which of monthly / one-time / day pass can be bought online
 *        right now, and the membership tiers, so the picker only offers what
 *        will work.
 *
 * POST { action: 'create_flex_checkout', partner_id, kind, tier_id? }
 *      — membership tiers: kind 'monthly' (subscription to the tier's Square
 *        plan variation), 'one_time' (a month at the tier's price) or
 *        'day_pass' (fixed price). Same auth rules; the server prices every
 *        checkout from the synced tiers (`_shared/membershipTiers.ts`).
 *
 * Deploy: `supabase functions deploy square-subscriptions`
 * Config: `[functions.square-subscriptions] verify_jwt = false` in config.toml
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { corsHeaders, json } from '../_shared/cors.ts';
import { getValidAccessToken, squareFetch } from '../_shared/square.ts';
import {
  type MembershipTier,
  membershipItemName,
  phasePriceCents,
  tiersFromCatalog,
  validateMembershipCheckout,
} from '../_shared/membershipTiers.ts';

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

type CreateFlexCheckoutRequest = {
  action: 'create_flex_checkout';
  partner_id: string;
  kind: unknown;
  tier_id?: unknown;
};

type MembershipOptionsRequest = {
  action: 'membership_options';
  partner_id: string;
};

type SubscriptionsRequest =
  | ListPlansRequest
  | CreateCheckoutRequest
  | CreateFlexCheckoutRequest
  | MembershipOptionsRequest;

const ACCEPTED_PAYMENT_METHODS = {
  apple_pay: true,
  google_pay: true,
  // Cash App Pay and Afterpay are not supported for subscriptions.
  cash_app_pay: false,
  afterpay_clearpay: false,
};

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

    // Verify subscriptions are enabled. `subscriptions_enabled` is the
    // partner's switch for selling memberships online (monthly, one-time and
    // day passes); monthly also needs a Square plan to bill under.
    const { data: config } = await admin
      .from('square_feature_config')
      .select('subscriptions_enabled, membership_plan_id')
      .eq('partner_id', body.partner_id)
      .single();

    // ── membership_options: public, never errors on a partner that isn't set up ──
    if (body.action === 'membership_options') {
      const { data: conn } = await admin
        .from('square_connections')
        .select('location_id')
        .eq('partner_id', body.partner_id)
        .maybeSingle();
      const open = Boolean(config?.subscriptions_enabled && conn?.location_id);
      const tiers = open ? await loadTiers(admin, body.partner_id, config?.membership_plan_id) : [];
      return json({
        monthly: tiers.length > 0,
        one_time: tiers.length > 0,
        day_pass: open,
        tiers: tiers.map((t) => ({ id: t.id, name: t.name, amount_cents: t.amountCents })),
      });
    }

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

    if (body.action !== 'create_checkout' && body.action !== 'create_flex_checkout') {
      return json({ error: 'Unknown action' }, 400);
    }

    // ── checkouts: require authenticated user ──
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
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://unicorn.gives';

    // A customer we already mapped to this user is recorded on the pending
    // row as matching evidence. Square Checkout picks (or creates) the
    // actual customer itself by the buyer's phone number, so we don't
    // pre-create one.
    const { data: existingCustomer } = await admin
      .from('square_customers')
      .select('square_customer_id')
      .eq('user_id', authUser.id)
      .eq('partner_id', body.partner_id)
      .order('synced_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    const squareCustomerId: string | undefined = existingCustomer?.square_customer_id;

    // ── create_flex_checkout: membership tiers and day passes ──
    if (body.action === 'create_flex_checkout') {
      const tiers = body.kind === 'day_pass' ? [] : await loadTiers(admin, body.partner_id, config.membership_plan_id);
      const v = validateMembershipCheckout(body.kind, body.tier_id, tiers);
      if (!v.ok) return json({ error: v.error }, 400);

      const { data: partner } = await admin
        .from('partners')
        .select('name, slug')
        .eq('id', body.partner_id)
        .single();
      if (!partner) return json({ error: 'Partner not found' }, 404);

      // Monthly subscribes to the tier's plan variation, at the variation's own
      // price, so Square bills renewals at that price with no override.
      const planVariationId = v.kind === 'monthly' ? v.tier.id : null;

      const redirectUrl = v.kind === 'monthly'
        ? `${siteUrl}/user/account/subscriptions?status=success`
        : `${siteUrl}/partners/${partner.slug}/membership?status=paid`;

      const flexRes = await squareFetch('/v2/online-checkout/payment-links', accessToken, {
        method: 'POST',
        body: JSON.stringify({
          idempotency_key: crypto.randomUUID(),
          quick_pay: {
            name: membershipItemName(v.kind, partner.name, v.tier?.name),
            price_money: { amount: v.amountCents, currency: 'USD' },
            location_id: locationId,
          },
          checkout_options: {
            ...(planVariationId ? { subscription_plan_id: planVariationId } : {}),
            ask_for_shipping_address: false,
            accepted_payment_methods: ACCEPTED_PAYMENT_METHODS,
            redirect_url: redirectUrl,
            enable_coupon: false,
            enable_loyalty: false,
          },
          pre_populated_data: { buyer_email: email },
        }),
      });
      if (!flexRes.ok) {
        console.error('Flex payment link creation failed:', await flexRes.text());
        return json({ error: 'Failed to create checkout link' }, 502);
      }
      const flexLink = (await flexRes.json() as {
        payment_link?: { id?: string; url?: string; order_id?: string };
      }).payment_link;
      if (!flexLink?.url) {
        return json({ error: 'Square did not return a checkout URL' }, 502);
      }

      if (v.kind === 'monthly') {
        await admin.from('square_subscriptions').insert({
          partner_id: body.partner_id,
          user_id: authUser.id,
          square_customer_id: squareCustomerId ?? null,
          plan_variation_id: planVariationId,
          tier: v.tier?.name ?? null,
          amount_cents: v.amountCents,
          customer_name: displayName || null,
          customer_email: email,
          status: 'pending',
          square_order_id: flexLink.order_id ?? null,
          square_payment_link_id: flexLink.id ?? null,
          raw: { payment_link: flexLink },
        });
      } else {
        await admin.from('partner_payments').insert({
          partner_id: body.partner_id,
          user_id: authUser.id,
          kind: v.kind === 'one_time' ? 'membership_one_time' : 'day_pass',
          tier: v.tier?.name ?? null,
          amount_cents: v.amountCents,
          status: 'pending',
          square_order_id: flexLink.order_id ?? null,
          square_payment_link_id: flexLink.id ?? null,
          raw: { payment_link: flexLink },
        });
      }

      return json({ checkout_url: flexLink.url, payment_link_id: flexLink.id });
    }

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
        phases?: Parameters<typeof phasePriceCents>[0][];
      };
    };
    const priceCents = phasePriceCents(planData.subscription_plan_variation_data?.phases?.[0]);
    if (!priceCents) {
      return json({ error: 'Plan variation has no price configured in Square' }, 400);
    }

    const redirectUrl = body.redirect_url ?? `${siteUrl}/user/account/subscriptions?status=success`;

    const linkBody = {
      idempotency_key: crypto.randomUUID(),
      quick_pay: {
        name: planData.subscription_plan_variation_data?.name ?? 'Membership',
        // Must match the plan variation's price, or Square treats it as an override.
        price_money: { amount: priceCents, currency: 'USD' },
        location_id: locationId,
      },
      checkout_options: {
        // A plan *variation* id: this is what makes Square enroll the buyer in
        // a recurring subscription instead of taking a one-time payment.
        subscription_plan_id: body.plan_variation_id,
        ask_for_shipping_address: false,
        accepted_payment_methods: ACCEPTED_PAYMENT_METHODS,
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

    // Without this row the paid subscription can't find its member, so don't
    // hand out the link if it wasn't saved.
    const { error: pendingErr } = await admin.from('square_subscriptions').insert({
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
    if (pendingErr) {
      console.error('Pending checkout insert failed:', pendingErr.message);
      return json({ error: 'Could not start checkout' }, 500);
    }

    return json({ checkout_url: checkoutUrl, payment_link_id: linkData.payment_link?.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    console.error('square-subscriptions error:', msg);
    return json({ error: msg }, 500);
  }
});

/** The partner's membership tiers, from the synced Square catalog. */
// deno-lint-ignore no-explicit-any
async function loadTiers(admin: any, partnerId: string, planId: string | null | undefined): Promise<MembershipTier[]> {
  if (!planId) return [];
  const { data: rows } = await admin
    .from('square_catalog_cache')
    .select('square_id, is_active, data')
    .eq('partner_id', partnerId)
    .eq('data_type', 'subscription_plan')
    .eq('is_active', true);
  return tiersFromCatalog(rows ?? [], planId);
}
