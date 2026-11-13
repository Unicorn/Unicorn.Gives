/**
 * Square Sync Edge Function
 *
 * POST { partner_id, features: ['bookings', 'subscriptions'] }
 *      Fetches data from Square APIs and upserts into cache tables.
 *      Called from admin UI "Sync Now" and by webhook handler.
 *
 * POST { action: 'create_membership_plan', partner_id, plan_name, tiers: [{ name, amountCents }] }
 *      Creates the partner's membership tiers in Square: one subscription
 *      plan with a fixed-price monthly variation per tier (Square's
 *      dashboard can only make item-based plans). Records the plan as the
 *      partner's membership plan and caches the tiers. Admin only.
 *
 * Deploy: `supabase functions deploy square-sync`
 * Config: `[functions.square-sync] verify_jwt = false` in config.toml
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { corsHeaders, json } from '../_shared/cors.ts';
import { getValidAccessToken, squareFetch } from '../_shared/square.ts';
import { createdPlanId, membershipPlanBatch, validateTierDrafts } from '../_shared/membershipTiers.ts';

type SyncRequest = {
  action?: 'sync';
  partner_id: string;
  features: string[];
};

type CreatePlanRequest = {
  action: 'create_membership_plan';
  partner_id: string;
  plan_name: unknown;
  tiers: unknown;
};

interface CatalogObject {
  id: string;
  type: string;
  is_deleted?: boolean;
  subscription_plan_variation_data?: { name?: string; subscription_plan_id?: string };
}

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

  let body: SyncRequest | CreatePlanRequest;
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

  // ── Create membership tiers in Square ──
  if (body.action === 'create_membership_plan') {
    const draft = validateTierDrafts(body.plan_name, body.tiers);
    if (!draft.ok) return json({ error: draft.error }, 400);

    const res = await squareFetch('/v2/catalog/batch-upsert', accessToken, {
      method: 'POST',
      body: JSON.stringify(membershipPlanBatch(draft.planName, draft.tiers, crypto.randomUUID())),
    });
    const created = await res.json().catch(() => ({})) as {
      objects?: CatalogObject[];
      id_mappings?: Array<{ client_object_id?: string; object_id?: string }>;
      errors?: Array<{ detail?: string; code?: string }>;
    };
    const planId = res.ok ? createdPlanId(created) : null;
    if (!planId) {
      const detail = created.errors?.map((e) => e.detail ?? e.code).filter(Boolean).join('; ');
      console.error('Membership plan creation failed:', res.status, JSON.stringify(created));
      return json({ error: `Square didn't create the plan${detail ? `: ${detail}` : ''}` }, 502);
    }

    const { error: configErr } = await admin
      .from('square_feature_config')
      .upsert({ partner_id: body.partner_id, membership_plan_id: planId }, { onConflict: 'partner_id' });
    if (configErr) {
      // The plan exists in Square now; say which one so it can be recorded by hand.
      return json({ error: `Plan ${planId} was created in Square but not saved here: ${configErr.message}` }, 500);
    }
    const cached = await cachePlanVariations(admin, body.partner_id, created.objects ?? [], planId);
    return json({ success: true, plan_id: planId, tiers: cached });
  }

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
      const { data: config } = await admin
        .from('square_feature_config')
        .select('membership_plan_id')
        .eq('partner_id', body.partner_id)
        .maybeSingle();

      // One Square account can serve several partners (The Horn and The Mane
      // share one), so cache only this partner's membership plan.
      const planId = (config?.membership_plan_id as string | null | undefined) ?? null;
      if (planId) {
        const objects: CatalogObject[] = [];
        let cursor: string | undefined;
        do {
          const qs = new URLSearchParams({ types: 'SUBSCRIPTION_PLAN_VARIATION' });
          if (cursor) qs.set('cursor', cursor);
          const catalogRes = await squareFetch(`/v2/catalog/list?${qs}`, accessToken);
          if (!catalogRes.ok) {
            subsResult.errors.push(`Subscription plans: ${catalogRes.status}`);
            await catalogRes.body?.cancel();
            break;
          }
          const page = await catalogRes.json() as { objects?: CatalogObject[]; cursor?: string };
          objects.push(...(page.objects ?? []));
          cursor = page.cursor;
        } while (cursor);

        if (subsResult.errors.length === 0) {
          subsResult.synced = (await cachePlanVariations(admin, body.partner_id, objects, planId)).length;
        }
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

/**
 * Cache the variations of `planId` as this partner's subscription plans and
 * retire every other cached plan, so the site only sells current tiers.
 * Returns the cached variations' names.
 */
// deno-lint-ignore no-explicit-any
async function cachePlanVariations(admin: any, partnerId: string, objects: CatalogObject[], planId: string) {
  const variations = objects.filter((o) =>
    o.type === 'SUBSCRIPTION_PLAN_VARIATION' &&
    !o.is_deleted &&
    o.subscription_plan_variation_data?.subscription_plan_id === planId
  );
  const now = new Date().toISOString();
  let order = 0;
  for (const v of variations) {
    const { error } = await admin.from('square_catalog_cache').upsert({
      partner_id: partnerId,
      data_type: 'subscription_plan',
      square_id: v.id,
      data: v,
      display_name: v.subscription_plan_variation_data?.name ?? null,
      display_order: order++,
      is_active: true,
      synced_at: now,
    }, { onConflict: 'partner_id,data_type,square_id' });
    if (error) throw new Error(`Caching plan ${v.id} failed: ${error.message}`);
  }
  let retire = admin
    .from('square_catalog_cache')
    .update({ is_active: false, synced_at: now })
    .eq('partner_id', partnerId)
    .eq('data_type', 'subscription_plan');
  if (variations.length) retire = retire.not('square_id', 'in', `(${variations.map((v) => v.id).join(',')})`);
  const { error: retireErr } = await retire;
  if (retireErr) throw new Error(`Retiring old plans failed: ${retireErr.message}`);
  return variations.map((v) => v.subscription_plan_variation_data?.name ?? v.id);
}
