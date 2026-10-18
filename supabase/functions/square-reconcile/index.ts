/**
 * Square Reconcile Edge Function — safety net for missed webhooks.
 *
 * POST { partner_id? }
 *   Iterates partners (or a single one) with a Square connection and re-pulls
 *   subscriptions/customers/bookings, upserting any drift. Logs into
 *   square_sync_jobs. Intended to be called on a schedule (hourly) or manually
 *   by super admins.
 *
 * Deploy: `supabase functions deploy square-reconcile`
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { corsHeaders, json } from '../_shared/cors.ts';
import {
  getValidAccessToken,
  retrieveCustomer,
  searchBookings,
  searchSubscriptions,
} from '../_shared/square.ts';
import {
  linkSubscription,
  reconcilePendingCheckouts,
  type SquareSubscription,
} from '../_shared/subscriptionLink.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(supabaseUrl, serviceKey);

  // Accept service-role or super_admin callers.
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token !== serviceKey) {
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: u } = await userClient.auth.getUser();
    if (!u.user) return json({ error: 'Unauthorized' }, 401);
    const { data: profile } = await admin
      .from('profiles').select('role').eq('id', u.user.id).single();
    if (profile?.role !== 'super_admin') return json({ error: 'Forbidden' }, 403);
  }

  const body = await req.json().catch(() => ({})) as { partner_id?: string };

  const partnersQuery = admin.from('square_connections').select('partner_id, access_token, location_id');
  const { data: connections } = body.partner_id
    ? await partnersQuery.eq('partner_id', body.partner_id)
    : await partnersQuery;

  const results: Array<{ partner_id: string; stats: Record<string, number>; error?: string }> = [];

  for (const conn of connections ?? []) {
    if (!conn.location_id) continue;

    const { data: jobRow } = await admin.from('square_sync_jobs').insert({
      partner_id: conn.partner_id,
      kind: 'full',
      status: 'running',
    }).select('id').single();

    const stats = { customers: 0, subscriptions: 0, bookings: 0, pending_linked: 0 };
    try {
      const creds = await getValidAccessToken(admin, conn.partner_id);
      if (!creds) throw new Error('No usable Square connection');
      const accessToken = creds.accessToken;

      // Checkouts whose subscription webhook never arrived. Runs first so the
      // customers it maps are refreshed by the loop below.
      stats.pending_linked = await reconcilePendingCheckouts(
        admin,
        accessToken,
        conn.partner_id,
        conn.location_id,
      );

      const { data: customers } = await admin
        .from('square_customers')
        .select('user_id, square_customer_id')
        .eq('partner_id', conn.partner_id);

      for (const cust of customers ?? []) {
        const fresh = await retrieveCustomer(accessToken, cust.square_customer_id);
        if (fresh) {
          await admin.from('square_customers').update({
            email: (fresh.email_address as string) ?? null,
            given_name: (fresh.given_name as string) ?? null,
            family_name: (fresh.family_name as string) ?? null,
            raw: fresh,
            synced_at: new Date().toISOString(),
          }).eq('partner_id', conn.partner_id).eq('square_customer_id', cust.square_customer_id);
          stats.customers++;
        }

        const subs = await searchSubscriptions(accessToken, cust.square_customer_id, conn.location_id);
        for (const sub of subs) {
          if (!(sub as SquareSubscription).id) continue;
          await linkSubscription(admin, accessToken, conn.partner_id, sub as SquareSubscription);
          stats.subscriptions++;
        }

        const bks = await searchBookings(accessToken, cust.square_customer_id, conn.location_id);
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
            partner_id: conn.partner_id,
            user_id: cust.user_id,
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

      await admin.from('square_sync_jobs').update({
        status: 'success',
        finished_at: new Date().toISOString(),
        stats,
      }).eq('id', jobRow?.id);

      results.push({ partner_id: conn.partner_id, stats });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'reconcile error';
      await admin.from('square_sync_jobs').update({
        status: 'error',
        finished_at: new Date().toISOString(),
        error: msg,
        stats,
      }).eq('id', jobRow?.id);
      results.push({ partner_id: conn.partner_id, stats, error: msg });
    }
  }

  return json({ ok: true, results });
});
