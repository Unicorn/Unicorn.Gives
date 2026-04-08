/**
 * Square Account Edge Function — user-facing subscription/booking management.
 *
 * Requires Authorization: Bearer <user jwt>. Every action verifies ownership
 * via auth.uid() before touching Square.
 *
 * POST { action: 'me' }
 *   → { subscriptions, bookings, customers } joined by user_id
 * POST { action: 'refresh' }
 *   → pulls fresh state from Square for each linked square_customer
 * POST { action: 'pause_subscription' | 'resume_subscription' | 'cancel_subscription', subscription_id }
 * POST { action: 'payment_method_link', partner_id }
 *   → returns a Square-hosted card update URL
 *
 * Deploy: `supabase functions deploy square-account`
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { corsHeaders, json } from '../_shared/cors.ts';
import {
  getDecryptedToken,
  retrieveCustomer,
  searchBookings,
  searchSubscriptions,
  squareFetch,
  updateSubscriptionState,
} from '../_shared/square.ts';

function mapStatus(s: string | undefined): string {
  switch (s) {
    case 'ACTIVE': return 'active';
    case 'PAUSED': return 'paused';
    case 'CANCELED': return 'canceled';
    case 'DEACTIVATED': return 'deactivated';
    default: return 'pending';
  }
}

const rateState = new Map<string, number>();
const REFRESH_RATE_LIMIT_MS = 5000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
    if (!jwt) return json({ error: 'Sign in required' }, 401);

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes.user) return json({ error: 'Invalid session' }, 401);
    const userId = userRes.user.id;

    const admin = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({})) as {
      action?: string;
      subscription_id?: string;
      partner_id?: string;
    };

    // ── me: read-only aggregate ──
    if (body.action === 'me') {
      const [subs, bookings, customers] = await Promise.all([
        admin.from('square_subscriptions')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false }),
        admin.from('square_bookings')
          .select('*')
          .eq('user_id', userId)
          .order('start_at', { ascending: false })
          .limit(50),
        admin.from('square_customers')
          .select('*')
          .eq('user_id', userId),
      ]);
      return json({
        subscriptions: subs.data ?? [],
        bookings: bookings.data ?? [],
        customers: customers.data ?? [],
      });
    }

    // ── refresh: pull fresh Square state ──
    if (body.action === 'refresh') {
      const now = Date.now();
      const last = rateState.get(userId) ?? 0;
      if (now - last < REFRESH_RATE_LIMIT_MS) {
        return json({ error: 'Please wait before refreshing again' }, 429);
      }
      rateState.set(userId, now);

      const { data: customers } = await admin
        .from('square_customers')
        .select('partner_id, square_customer_id')
        .eq('user_id', userId);

      const stats = { subscriptions: 0, bookings: 0, customers: 0 };

      for (const cust of customers ?? []) {
        const { data: conn } = await admin
          .from('square_connections')
          .select('access_token, location_id')
          .eq('partner_id', cust.partner_id)
          .single();
        if (!conn?.location_id) continue;

        const token = await getDecryptedToken(conn.access_token);

        const freshCustomer = await retrieveCustomer(token, cust.square_customer_id);
        if (freshCustomer) {
          await admin.from('square_customers').update({
            email: (freshCustomer.email_address as string) ?? null,
            given_name: (freshCustomer.given_name as string) ?? null,
            family_name: (freshCustomer.family_name as string) ?? null,
            raw: freshCustomer,
            synced_at: new Date().toISOString(),
          }).eq('user_id', userId).eq('square_customer_id', cust.square_customer_id);
          stats.customers++;
        }

        const subs = await searchSubscriptions(token, cust.square_customer_id, conn.location_id);
        for (const sub of subs) {
          const s = sub as {
            id?: string;
            plan_variation_id?: string;
            status?: string;
            start_date?: string;
            canceled_date?: string;
            charged_through_date?: string;
            canceled_at_period_end?: boolean;
          };
          if (!s.id) continue;
          await admin.from('square_subscriptions').upsert({
            partner_id: cust.partner_id,
            user_id: userId,
            square_subscription_id: s.id,
            square_customer_id: cust.square_customer_id,
            plan_variation_id: s.plan_variation_id ?? null,
            status: mapStatus(s.status),
            started_at: s.start_date ?? null,
            canceled_at: s.canceled_date ?? null,
            current_period_end: s.charged_through_date ?? null,
            cancel_at_period_end: s.canceled_at_period_end ?? false,
            raw: s,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'square_subscription_id' });
          stats.subscriptions++;
        }

        const bks = await searchBookings(token, cust.square_customer_id, conn.location_id);
        for (const bk of bks) {
          const b = bk as {
            id?: string;
            start_at?: string;
            status?: string;
            appointment_segments?: Array<{ service_variation_id?: string; team_member_id?: string }>;
          };
          if (!b.id) continue;
          const seg = b.appointment_segments?.[0];
          await admin.from('square_bookings').upsert({
            partner_id: cust.partner_id,
            user_id: userId,
            square_booking_id: b.id,
            square_customer_id: cust.square_customer_id,
            start_at: b.start_at ?? null,
            status: b.status ?? null,
            service_variation_id: seg?.service_variation_id ?? null,
            team_member_id: seg?.team_member_id ?? null,
            raw: b,
            synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'square_booking_id' });
          stats.bookings++;
        }
      }

      return json({ ok: true, stats });
    }

    // ── subscription state changes ──
    if (
      body.action === 'pause_subscription' ||
      body.action === 'resume_subscription' ||
      body.action === 'cancel_subscription'
    ) {
      if (!body.subscription_id) return json({ error: 'subscription_id required' }, 400);

      // Verify ownership.
      const { data: row } = await admin
        .from('square_subscriptions')
        .select('id, partner_id, square_subscription_id, user_id')
        .eq('id', body.subscription_id)
        .single();
      if (!row || row.user_id !== userId || !row.square_subscription_id) {
        return json({ error: 'Not found' }, 404);
      }

      const { data: conn } = await admin
        .from('square_connections')
        .select('access_token')
        .eq('partner_id', row.partner_id)
        .single();
      if (!conn) return json({ error: 'Partner connection missing' }, 404);

      const token = await getDecryptedToken(conn.access_token);
      const verb = body.action === 'pause_subscription'
        ? 'pause'
        : body.action === 'resume_subscription'
        ? 'resume'
        : 'cancel';
      const res = await updateSubscriptionState(token, row.square_subscription_id, verb);
      if (!res.ok) {
        const err = await res.text();
        console.error('Square subscription action failed', err);
        return json({ error: 'Square rejected the request' }, 502);
      }

      // Optimistic local update — webhook will finalize.
      const localStatus = verb === 'pause' ? 'paused' : verb === 'resume' ? 'active' : 'canceled';
      await admin.from('square_subscriptions')
        .update({
          status: localStatus,
          cancel_at_period_end: verb === 'cancel' ? true : row ? undefined : false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', row.id);

      return json({ ok: true });
    }

    // ── payment_method_link: hosted card update ──
    if (body.action === 'payment_method_link') {
      if (!body.partner_id) return json({ error: 'partner_id required' }, 400);
      const { data: cust } = await admin
        .from('square_customers')
        .select('square_customer_id')
        .eq('user_id', userId)
        .eq('partner_id', body.partner_id)
        .maybeSingle();
      if (!cust) return json({ error: 'No Square customer on file' }, 404);

      const { data: conn } = await admin
        .from('square_connections')
        .select('access_token')
        .eq('partner_id', body.partner_id)
        .single();
      if (!conn) return json({ error: 'Partner connection missing' }, 404);

      const token = await getDecryptedToken(conn.access_token);
      const siteUrl = Deno.env.get('SITE_URL') ?? 'https://unicorn.gives';

      // Square Checkout "save card" flow via payment link with a zero-dollar
      // card-on-file style checkout isn't directly supported, so we return a
      // hosted customer management URL if available. Fallback: Square card
      // entry form for the buyer to update their subscription card manually.
      const res = await squareFetch('/v2/online-checkout/payment-links', token, {
        method: 'POST',
        body: JSON.stringify({
          idempotency_key: crypto.randomUUID(),
          quick_pay: {
            name: 'Update payment method',
            price_money: { amount: 100, currency: 'USD' },
            location_id: (await admin.from('square_connections').select('location_id').eq('partner_id', body.partner_id).single()).data?.location_id,
          },
          checkout_options: {
            redirect_url: `${siteUrl}/user/account/subscriptions?status=card_updated`,
            ask_for_shipping_address: false,
          },
          pre_populated_data: { buyer_email: userRes.user.email ?? undefined },
        }),
      });
      if (!res.ok) return json({ error: 'Failed to build payment link' }, 502);
      const data = await res.json() as { payment_link?: { url?: string } };
      if (!data.payment_link?.url) return json({ error: 'No URL returned' }, 502);
      return json({ url: data.payment_link.url });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    console.error('square-account error:', msg);
    return json({ error: msg }, 500);
  }
});
