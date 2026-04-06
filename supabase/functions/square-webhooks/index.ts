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

  // Process event
  try {
    if (partnerId && (BOOKING_EVENTS.has(eventType) || CATALOG_EVENTS.has(eventType))) {
      // Trigger a sync for the affected partner
      // We call the sync endpoint internally using service role
      const features: string[] = [];
      if (BOOKING_EVENTS.has(eventType)) features.push('bookings');
      if (CATALOG_EVENTS.has(eventType)) features.push('catalog');

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
