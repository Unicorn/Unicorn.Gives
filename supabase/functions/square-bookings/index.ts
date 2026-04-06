/**
 * Square Bookings Edge Function (public-facing)
 *
 * POST { action: 'search_availability', partner_id, service_variation_id, start_at, end_at }
 * POST { action: 'create_booking', partner_id, service_variation_id, team_member_id?, start_at, customer }
 *
 * No auth required (customer-facing). Rate-limited by IP.
 *
 * Deploy: `supabase functions deploy square-bookings`
 * Config: `[functions.square-bookings] verify_jwt = false` in config.toml
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { corsHeaders, json } from '../_shared/cors.ts';
import { getDecryptedToken, squareFetch } from '../_shared/square.ts';

const rateState = new Map<string, number>();
const RATE_LIMIT_MS = 500; // 2 req/sec per IP

type AvailabilityRequest = {
  action: 'search_availability';
  partner_id: string;
  service_variation_id: string;
  start_at: string;  // ISO 8601
  end_at: string;    // ISO 8601
  team_member_id?: string;
};

type CreateBookingRequest = {
  action: 'create_booking';
  partner_id: string;
  service_variation_id: string;
  team_member_id?: string;
  start_at: string;
  customer: {
    given_name: string;
    family_name?: string;
    email_address?: string;
    phone_number?: string;
  };
  note?: string;
};

type BookingsRequest = AvailabilityRequest | CreateBookingRequest;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // Basic rate limiting by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const now = Date.now();
  const lastRequest = rateState.get(ip) ?? 0;
  if (now - lastRequest < RATE_LIMIT_MS) {
    return json({ error: 'Too many requests' }, 429);
  }
  rateState.set(ip, now);

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  let body: BookingsRequest;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  // Get connection for the partner
  const { data: conn } = await admin
    .from('square_connections')
    .select('access_token, location_id')
    .eq('partner_id', body.partner_id)
    .single();

  if (!conn || !conn.location_id) {
    return json({ error: 'No Square connection for this partner' }, 404);
  }

  // Verify bookings are enabled
  const { data: config } = await admin
    .from('square_feature_config')
    .select('bookings_enabled')
    .eq('partner_id', body.partner_id)
    .single();

  if (!config?.bookings_enabled) {
    return json({ error: 'Bookings not enabled for this partner' }, 403);
  }

  const accessToken = await getDecryptedToken(conn.access_token);
  const locationId = conn.location_id;

  try {
    if (body.action === 'search_availability') {
      const searchBody: Record<string, unknown> = {
        query: {
          filter: {
            start_at_range: {
              start_at: body.start_at,
              end_at: body.end_at,
            },
            location_id: locationId,
            segment_filters: [{
              service_variation_id: body.service_variation_id,
              ...(body.team_member_id ? { team_member_id_filter: { any: [body.team_member_id] } } : {}),
            }],
          },
        },
      };

      const res = await squareFetch('/v2/bookings/availability/search', accessToken, {
        method: 'POST',
        body: JSON.stringify(searchBody),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Availability search failed:', errText);
        return json({ error: 'Failed to search availability' }, 502);
      }

      const data = await res.json();
      return json(data);
    }

    if (body.action === 'create_booking') {
      // First, create or find the customer
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

      let customerId: string | undefined;
      if (customerRes.ok) {
        const customerData = await customerRes.json() as {
          customer?: { id: string };
        };
        customerId = customerData.customer?.id;
      }

      // Create the booking
      const bookingBody = {
        idempotency_key: crypto.randomUUID(),
        booking: {
          location_id: locationId,
          customer_id: customerId,
          customer_note: body.note ?? '',
          start_at: body.start_at,
          appointment_segments: [{
            service_variation_id: body.service_variation_id,
            service_variation_version: 0, // Square may require this
            ...(body.team_member_id ? { team_member_id: body.team_member_id } : { any_team_member: true }),
          }],
        },
      };

      const res = await squareFetch('/v2/bookings', accessToken, {
        method: 'POST',
        body: JSON.stringify(bookingBody),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Create booking failed:', errText);
        return json({ error: 'Failed to create booking' }, 502);
      }

      const data = await res.json();
      return json(data);
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Request failed';
    console.error('square-bookings error:', msg);
    return json({ error: msg }, 502);
  }

  } catch (outerErr) {
    const msg = outerErr instanceof Error ? outerErr.message : 'Internal error';
    console.error('square-bookings outer error:', msg);
    return json({ error: msg }, 500);
  }
});
