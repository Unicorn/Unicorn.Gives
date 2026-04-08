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
  'subscription.updated',
  'subscription.canceled',
]);

const CUSTOMER_EVENTS = new Set([
  'customer.created',
  'customer.updated',
]);

const INVOICE_EVENTS = new Set([
  'invoice.payment_made',
  'invoice.scheduled_charge_failed',
  'invoice.updated',
]);

function mapSquareSubscriptionStatus(status: string | undefined): string {
  switch (status) {
    case 'ACTIVE':
      return 'active';
    case 'PAUSED':
      return 'paused';
    case 'CANCELED':
      return 'canceled';
    case 'DEACTIVATED':
      return 'deactivated';
    default:
      return 'pending';
  }
}

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
  return computed === signature;
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
  const webhookUrl = `${supabaseUrl}/functions/v1/square-webhooks`;

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
      const sub = event.data?.object?.subscription as {
        id?: string;
        customer_id?: string;
        plan_variation_id?: string;
        status?: string;
        start_date?: string;
        canceled_date?: string;
        charged_through_date?: string;
        canceled_at_period_end?: boolean;
      } | undefined;

      if (sub?.id) {
        const userId = await resolveUserId(sub.customer_id);
        await admin.from('square_subscriptions').upsert({
          partner_id: partnerId,
          user_id: userId,
          square_subscription_id: sub.id,
          square_customer_id: sub.customer_id ?? null,
          plan_variation_id: sub.plan_variation_id ?? null,
          status: mapSquareSubscriptionStatus(sub.status),
          started_at: sub.start_date ?? null,
          canceled_at: sub.canceled_date ?? null,
          current_period_end: sub.charged_through_date ?? null,
          cancel_at_period_end: sub.canceled_at_period_end ?? false,
          raw: event.data?.object ?? {},
          updated_at: new Date().toISOString(),
        }, { onConflict: 'square_subscription_id' });
      }
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
