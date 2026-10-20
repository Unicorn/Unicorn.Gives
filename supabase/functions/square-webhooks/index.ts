/**
 * Square Webhooks Edge Function
 *
 * POST /square-webhooks — Receives Square webhook events.
 * Verifies HMAC signature, logs event, triggers sync for relevant partners.
 *
 * Deploy: `supabase functions deploy square-webhooks`
 * Config: `[functions.square-webhooks] verify_jwt = false` in config.toml
 * Secrets: SQUARE_WEBHOOK_SIGNATURE_KEY
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { corsHeaders, json } from '../_shared/cors.ts';
import { getValidAccessToken } from '../_shared/square.ts';
import { linkSubscription, type SquareSubscription } from '../_shared/subscriptionLink.ts';
import { settlePaymentByOrder } from '../_shared/paymentSettle.ts';

const BOOKING_EVENTS = new Set([
  'booking.created',
  'booking.updated',
  'booking.cancelled',
]);

const CATALOG_EVENTS = new Set([
  'catalog.version.updated',
]);

const SUBSCRIPTION_EVENTS = new Set([
  'subscription.created',
  'subscription.updated', // Square reports cancellation as an update
]);

const CUSTOMER_EVENTS = new Set([
  'customer.created',
  'customer.updated',
]);

// Payment-link orders for one-time memberships and day passes.
const ORDER_EVENTS = new Set([
  'order.updated',
]);

const INVOICE_EVENTS = new Set([
  'invoice.payment_made',
  'invoice.scheduled_charge_failed',
  'invoice.updated',
]);

async function verifySignature(
  body: string,
  signature: string,
  signatureKey: string,
  webhookUrl: string,
): Promise<boolean> {
  // Square HMAC-SHA256 signature verification
  // Signature is base64(HMAC-SHA256(webhookUrl + body, signatureKey))
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(signatureKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const data = encoder.encode(webhookUrl + body);
  const sig = await crypto.subtle.sign('HMAC', key, data);
  const computed = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return timingSafeEqual(computed, signature);
}

/** Compare without exiting at the first differing byte. */
function timingSafeEqual(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const signatureKey = Deno.env.get('SQUARE_WEBHOOK_SIGNATURE_KEY');
  if (!signatureKey) {
    console.error('SQUARE_WEBHOOK_SIGNATURE_KEY not configured');
    return json({ error: 'Server misconfigured' }, 500);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const bodyText = await req.text();
  const signature = req.headers.get('x-square-hmacsha256-signature') ?? '';
  // Square signs the notification URL exactly as registered in its developer
  // dashboard. Set SQUARE_WEBHOOK_URL if that differs from the default.
  const webhookUrl = Deno.env.get('SQUARE_WEBHOOK_URL') ?? `${supabaseUrl}/functions/v1/square-webhooks`;

  const valid = await verifySignature(bodyText, signature, signatureKey, webhookUrl);
  if (!valid) {
    console.error('Invalid webhook signature');
    return json({ error: 'Invalid signature' }, 401);
  }

  let event: {
    event_id?: string;
    type?: string;
    merchant_id?: string;
    data?: { type?: string; id?: string; object?: Record<string, unknown> };
  };
  try {
    event = JSON.parse(bodyText);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const eventId = event.event_id ?? crypto.randomUUID();
  const eventType = event.type ?? 'unknown';
  const merchantId = event.merchant_id ?? null;

  // Check idempotency
  const { data: existing } = await admin
    .from('square_webhook_events')
    .select('id')
    .eq('event_id', eventId)
    .single();

  if (existing) {
    return json({ status: 'already_processed' });
  }

  // Find partner by merchant_id
  let partnerId: string | null = null;
  if (merchantId) {
    const { data: conn } = await admin
      .from('square_connections')
      .select('partner_id')
      .eq('merchant_id', merchantId)
      .single();
    partnerId = conn?.partner_id ?? null;
  }

  // Log the event
  await admin.from('square_webhook_events').insert({
    event_id: eventId,
    event_type: eventType,
    merchant_id: merchantId,
    partner_id: partnerId,
    payload: event,
    processed: false,
  });

  // Helper: resolve user_id from a Square customer id for this partner.
  async function resolveUserId(customerId: string | undefined): Promise<string | null> {
    if (!customerId || !partnerId) return null;
    const { data } = await admin
      .from('square_customers')
      .select('user_id')
      .eq('partner_id', partnerId)
      .eq('square_customer_id', customerId)
      .maybeSingle();
    return data?.user_id ?? null;
  }

  // Process event
  try {
    if (partnerId && CUSTOMER_EVENTS.has(eventType)) {
      const customer = event.data?.object?.customer as {
        id?: string;
        email_address?: string;
        given_name?: string;
        family_name?: string;
        reference_id?: string;
      } | undefined;

      if (customer?.id) {
        // Prefer existing user_id mapping; fall back to reference_id (we set this on create).
        const { data: existing } = await admin
          .from('square_customers')
          .select('user_id')
          .eq('partner_id', partnerId)
          .eq('square_customer_id', customer.id)
          .maybeSingle();

        const userId = existing?.user_id ?? customer.reference_id ?? null;

        if (userId) {
          await admin.from('square_customers').upsert({
            user_id: userId,
            partner_id: partnerId,
            square_customer_id: customer.id,
            email: customer.email_address ?? null,
            given_name: customer.given_name ?? null,
            family_name: customer.family_name ?? null,
            raw: customer,
            synced_at: new Date().toISOString(),
          }, { onConflict: 'partner_id,square_customer_id' });
        }
      }
    }

    if (partnerId && SUBSCRIPTION_EVENTS.has(eventType)) {
      const sub = event.data?.object?.subscription as SquareSubscription | undefined;

      if (sub?.id) {
        // A broken connection only weakens matching; the event is still stored.
        const creds = await getValidAccessToken(admin, partnerId);
        const { outcome } = await linkSubscription(
          admin,
          creds?.accessToken ?? null,
          partnerId,
          sub,
          event.data?.object ?? {},
        );
        console.log(`subscription ${sub.id}: ${outcome}`);
      }
    }

    if (partnerId && ORDER_EVENTS.has(eventType) && event.data?.id) {
      const creds = await getValidAccessToken(admin, partnerId);
      if (creds) await settlePaymentByOrder(admin, creds.accessToken, event.data.id);
    }

    if (partnerId && INVOICE_EVENTS.has(eventType)) {
      const invoice = event.data?.object?.invoice as {
        subscription_id?: string;
        next_payment_amount_money?: { amount?: number };
        scheduled_at?: string;
      } | undefined;
      if (invoice?.subscription_id && invoice.scheduled_at) {
        await admin.from('square_subscriptions')
          .update({ next_billing_at: invoice.scheduled_at, updated_at: new Date().toISOString() })
          .eq('square_subscription_id', invoice.subscription_id);
      }
    }

    if (partnerId && BOOKING_EVENTS.has(eventType)) {
      const booking = event.data?.object?.booking as {
        id?: string;
        customer_id?: string;
        start_at?: string;
        status?: string;
        appointment_segments?: Array<{
          service_variation_id?: string;
          team_member_id?: string;
        }>;
      } | undefined;
      if (booking?.id) {
        const userId = await resolveUserId(booking.customer_id);
        const segment = booking.appointment_segments?.[0];
        await admin.from('square_bookings').upsert({
          partner_id: partnerId,
          user_id: userId,
          square_booking_id: booking.id,
          square_customer_id: booking.customer_id ?? null,
          start_at: booking.start_at ?? null,
          status: booking.status ?? null,
          service_variation_id: segment?.service_variation_id ?? null,
          team_member_id: segment?.team_member_id ?? null,
          raw: event.data?.object ?? {},
          synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'square_booking_id' });
      }
    }

    if (partnerId && (BOOKING_EVENTS.has(eventType) || CATALOG_EVENTS.has(eventType))) {
      // Trigger a sync for the affected partner
      // We call the sync endpoint internally using service role
      const features: string[] = [];
      if (BOOKING_EVENTS.has(eventType)) features.push('bookings');
      if (CATALOG_EVENTS.has(eventType)) features.push('catalog', 'subscriptions');

      // Internal call to square-sync using service role key
      const syncRes = await fetch(`${supabaseUrl}/functions/v1/square-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ partner_id: partnerId, features }),
      });

      if (!syncRes.ok) {
        const errText = await syncRes.text();
        console.error('Sync trigger failed:', errText);
      }
    }

    // Mark as processed
    await admin.from('square_webhook_events').update({ processed: true }).eq('event_id', eventId);
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : 'Processing failed';
    await admin.from('square_webhook_events').update({
      error: errMsg,
    }).eq('event_id', eventId);
    console.error('Webhook processing error:', errMsg);
  }

  return json({ status: 'ok' });
});
