/**
 * Square Sync Edge Function
 *
 * POST { partner_id, features: ['bookings'] }
 *
 * Fetches data from Square APIs and upserts into cache tables.
 * Called from admin UI "Sync Now" and by webhook handler.
 *
 * Deploy: `supabase functions deploy square-sync`
 * Config: `[functions.square-sync] verify_jwt = false` in config.toml
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { corsHeaders, json } from '../_shared/cors.ts';
import { getValidAccessToken, squareFetch } from '../_shared/square.ts';

type SyncRequest = {
  partner_id: string;
  features: string[];
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // Auth check
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Missing authorization' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const userClient = createClient(supabaseUrl, supabaseAnon, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData } = await userClient.auth.getUser();
  if (!userData.user) return json({ error: 'Unauthorized' }, 401);

  const { data: profile } = await userClient
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  if (!profile?.role || !['super_admin', 'partner_editor'].includes(profile.role)) {
    return json({ error: 'Forbidden' }, 403);
  }

  let body: SyncRequest;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  // Refreshes the token in place if it has expired or is about to.
  const creds = await getValidAccessToken(admin, body.partner_id);
  if (!creds) {
    return json({
      error: 'No usable Square connection for this partner. Try disconnecting and reconnecting Square.',
    }, 404);
  }
  const { accessToken, locationId } = creds;

  const results: Record<string, { synced: number; errors: string[] }> = {};

  // ── Sync Bookings ──
  if (body.features.includes('bookings') && locationId) {
    const bookingsResult = { synced: 0, errors: [] as string[] };

    try {
      // 1. Fetch team members for this location
      const teamRes = await squareFetch(
        `/v2/team-members/search`,
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            query: {
              filter: {
                location_ids: [locationId],
                status: 'ACTIVE',
              },
            },
          }),
        },
      );

      if (teamRes.ok) {
        const teamData = await teamRes.json() as {
          team_members?: Array<{
            id: string;
            given_name?: string;
            family_name?: string;
            email_address?: string;
            phone_number?: string;
            status?: string;
          }>;
        };

        for (const member of teamData.team_members ?? []) {
          const displayName = [member.given_name, member.family_name].filter(Boolean).join(' ');
          await admin.from('square_bookings_cache').upsert({
            partner_id: body.partner_id,
            data_type: 'team_member',
            square_id: member.id,
            data: member,
            display_name: displayName || null,
            is_active: member.status === 'ACTIVE',
            synced_at: new Date().toISOString(),
          }, { onConflict: 'partner_id,data_type,square_id' });
          bookingsResult.synced++;
        }
      } else {
        bookingsResult.errors.push(`Team members: ${teamRes.status}`);
      }

      // 2. Fetch catalog items (services) + related categories in one call
      const catalogRes = await squareFetch(
        '/v2/catalog/search-catalog-items',
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            product_types: ['APPOINTMENTS_SERVICE'],
            include_related_objects: true,
          }),
        },
      );

      if (catalogRes.ok) {
        const catalogData = await catalogRes.json() as {
          items?: Array<{
            id: string;
            type: string;
            item_data?: {
              name?: string;
              description?: string;
              category_id?: string;
              categories?: Array<{ id?: string; ordinal?: number }>;
              reporting_category?: { id?: string };
              variations?: Array<{
                id: string;
                item_variation_data?: {
                  name?: string;
                  price_money?: { amount?: number; currency?: string };
                  service_duration?: number;
                };
              }>;
            };
          }>;
          related_objects?: Array<{
            id: string;
            type: string;
            category_data?: { name?: string; parent_category?: { id?: string } };
          }>;
        };

        let order = 0;
        for (const item of catalogData.items ?? []) {
          await admin.from('square_bookings_cache').upsert({
            partner_id: body.partner_id,
            data_type: 'service',
            square_id: item.id,
            data: item,
            display_name: item.item_data?.name ?? null,
            display_order: order++,
            is_active: true,
            synced_at: new Date().toISOString(),
          }, { onConflict: 'partner_id,data_type,square_id' });
          bookingsResult.synced++;
        }

        // Collect category IDs referenced by services (from related_objects or inline).
        const categoryIds = new Set<string>();
        for (const related of catalogData.related_objects ?? []) {
          if (related.type === 'CATEGORY') categoryIds.add(related.id);
        }
        for (const item of catalogData.items ?? []) {
          const idata = item.item_data;
          if (idata?.category_id) categoryIds.add(idata.category_id);
          if (idata?.reporting_category?.id) categoryIds.add(idata.reporting_category.id);
          for (const c of idata?.categories ?? []) {
            if (c.id) categoryIds.add(c.id);
          }
        }

        // Fetch full category objects via batch-retrieve for accurate names.
        let catalogCategories: Array<{ id: string; category_data?: { name?: string } }> = [];
        if (categoryIds.size > 0) {
          const catRes = await squareFetch(
            '/v2/catalog/batch-retrieve',
            accessToken,
            {
              method: 'POST',
              body: JSON.stringify({ object_ids: Array.from(categoryIds) }),
            },
          );
          if (catRes.ok) {
            const catData = await catRes.json() as {
              objects?: Array<{ id: string; type: string; category_data?: { name?: string } }>;
            };
            catalogCategories = (catData.objects ?? []).filter((o) => o.type === 'CATEGORY');
          } else {
            bookingsResult.errors.push(`Categories: ${catRes.status}`);
          }
        }

        // Upsert categories into square_catalog_cache so the UI can resolve
        // category IDs → names for grouping/filtering.
        let catOrder = 0;
        for (const cat of catalogCategories) {
          await admin.from('square_catalog_cache').upsert({
            partner_id: body.partner_id,
            data_type: 'category',
            square_id: cat.id,
            data: cat,
            display_name: cat.category_data?.name ?? null,
            display_order: catOrder++,
            is_active: true,
            synced_at: new Date().toISOString(),
          }, { onConflict: 'partner_id,data_type,square_id' });
          bookingsResult.synced++;
        }
      } else {
        bookingsResult.errors.push(`Catalog: ${catalogRes.status}`);
      }

      // 3. Fetch location booking profile
      const profileRes = await squareFetch(
        `/v2/bookings/location-booking-profiles/${locationId}`,
        accessToken,
      );

      if (profileRes.ok) {
        const profileData = await profileRes.json() as {
          location_booking_profile?: Record<string, unknown>;
        };

        if (profileData.location_booking_profile) {
          await admin.from('square_bookings_cache').upsert({
            partner_id: body.partner_id,
            data_type: 'booking_profile',
            square_id: locationId,
            data: profileData.location_booking_profile,
            display_name: 'Location Profile',
            is_active: true,
            synced_at: new Date().toISOString(),
          }, { onConflict: 'partner_id,data_type,square_id' });
          bookingsResult.synced++;
        }
      } else {
        // A 404 here is not benign: it means this location has no booking
        // profile, so there is no hosted Square booking site to fall back to.
        // Report it rather than swallowing it.
        bookingsResult.errors.push(
          profileRes.status === 404
            ? 'Location booking profile: not found (online booking may be disabled for this location)'
            : `Location booking profile: ${profileRes.status}`,
        );
      }

      // 3b. Business-level booking profile — tells us whether the seller has
      // online booking switched on at all, which decides whether linking out to
      // Square's hosted booking site is even possible.
      const bizRes = await squareFetch('/v2/bookings/business-booking-profile', accessToken);
      if (bizRes.ok) {
        const bizData = await bizRes.json() as {
          business_booking_profile?: Record<string, unknown>;
        };
        if (bizData.business_booking_profile) {
          await admin.from('square_bookings_cache').upsert({
            partner_id: body.partner_id,
            data_type: 'business_booking_profile',
            square_id: String(bizData.business_booking_profile.seller_id ?? 'business'),
            data: bizData.business_booking_profile,
            display_name: 'Business Booking Profile',
            is_active: true,
            synced_at: new Date().toISOString(),
          }, { onConflict: 'partner_id,data_type,square_id' });
          bookingsResult.synced++;
        }
      } else {
        bookingsResult.errors.push(`Business booking profile: ${bizRes.status}`);
      }
    } catch (e) {
      bookingsResult.errors.push(e instanceof Error ? e.message : 'Unknown error');
    }

    results.bookings = bookingsResult;
  }

  // ── Sync Subscription Plans ──
  if (body.features.includes('subscriptions')) {
    const subsResult = { synced: 0, errors: [] as string[] };

    try {
      // Fetch SUBSCRIPTION_PLAN catalog objects + variations.
      const catalogRes = await squareFetch(
        '/v2/catalog/list?types=SUBSCRIPTION_PLAN,SUBSCRIPTION_PLAN_VARIATION',
        accessToken,
      );

      if (catalogRes.ok) {
        const data = await catalogRes.json() as {
          objects?: Array<{
            id: string;
            type: string;
            subscription_plan_data?: {
              name?: string;
              subscription_plan_variations?: Array<{
                id: string;
                subscription_plan_variation_data?: {
                  name?: string;
                  phases?: Array<{
                    cadence?: string;
                    pricing?: { price?: { amount?: number; currency?: string } };
                  }>;
                };
              }>;
            };
            subscription_plan_variation_data?: {
              name?: string;
              subscription_plan_id?: string;
              phases?: Array<{
                cadence?: string;
                pricing?: { price?: { amount?: number; currency?: string } };
              }>;
            };
          }>;
        };

        let order = 0;
        for (const obj of data.objects ?? []) {
          // Only store subscription plan variations — those are what checkout uses.
          if (obj.type !== 'SUBSCRIPTION_PLAN_VARIATION') continue;

          const displayName = obj.subscription_plan_variation_data?.name ?? null;
          await admin.from('square_catalog_cache').upsert({
            partner_id: body.partner_id,
            data_type: 'subscription_plan',
            square_id: obj.id,
            data: obj,
            display_name: displayName,
            display_order: order++,
            is_active: true,
            synced_at: new Date().toISOString(),
          }, { onConflict: 'partner_id,data_type,square_id' });
          subsResult.synced++;
        }
      } else {
        subsResult.errors.push(`Subscription plans: ${catalogRes.status}`);
      }
    } catch (e) {
      subsResult.errors.push(e instanceof Error ? e.message : 'Unknown error');
    }

    results.subscriptions = subsResult;
  }

  // Update last synced timestamp
  await admin.from('square_feature_config').update({
    last_synced_at: new Date().toISOString(),
  }).eq('partner_id', body.partner_id);

  return json({ success: true, results });

  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    console.error('square-sync error:', msg);
    return json({ error: msg }, 500);
  }
});
