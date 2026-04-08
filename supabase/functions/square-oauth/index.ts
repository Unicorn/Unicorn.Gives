/**
 * Square OAuth Edge Function
 *
 * GET  ?action=authorize&partner_id=X  → Redirect to Square OAuth
 * GET  ?action=callback&code=X&state=Y → Exchange code, store tokens
 * POST {action:'disconnect', partner_id} → Revoke + delete
 * POST {action:'refresh', partner_id}    → Refresh expired token
 *
 * Deploy: `supabase functions deploy square-oauth`
 * Config: `[functions.square-oauth] verify_jwt = false` in config.toml
 * Secrets: SQUARE_APP_ID, SQUARE_APP_SECRET, SQUARE_ENCRYPTION_KEY, SQUARE_ENVIRONMENT
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { corsHeaders, json, redirect } from '../_shared/cors.ts';
import { encrypt, decrypt } from '../_shared/crypto.ts';
import { squareOAuthUrl, squareBaseUrl } from '../_shared/square.ts';

const SCOPES = [
  'APPOINTMENTS_READ',
  'APPOINTMENTS_WRITE',
  'ITEMS_READ',
  'ORDERS_READ',
  'ORDERS_WRITE',
  'MERCHANT_PROFILE_READ',
  'CUSTOMERS_READ',
  'CUSTOMERS_WRITE',
  'GIFTCARDS_READ',
  'SUBSCRIPTIONS_READ',
  'SUBSCRIPTIONS_WRITE',
  'PAYMENTS_WRITE',
].join('+');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const appId = Deno.env.get('SQUARE_APP_ID');
  const appSecret = Deno.env.get('SQUARE_APP_SECRET');
  const encryptionKey = Deno.env.get('SQUARE_ENCRYPTION_KEY');

  if (!appId || !appSecret || !encryptionKey) {
    return json({ error: 'Square not configured. Set SQUARE_APP_ID, SQUARE_APP_SECRET, SQUARE_ENCRYPTION_KEY.' }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  // ── GET: authorize or callback ──
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'authorize') {
      const partnerId = url.searchParams.get('partner_id');
      if (!partnerId) return json({ error: 'partner_id required' }, 400);

      // Verify user auth from cookie/header
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const userClient = createClient(supabaseUrl, supabaseAnon, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: userData } = await userClient.auth.getUser();
        if (!userData.user) return json({ error: 'Unauthorized' }, 401);
      }

      // Generate state token for CSRF protection
      const state = crypto.randomUUID();
      await admin.from('square_webhook_events').insert({
        event_id: `oauth_state_${state}`,
        event_type: 'oauth_state',
        merchant_id: partnerId,
        payload: { partner_id: partnerId, created_at: new Date().toISOString() },
        processed: false,
      });

      const oauthBase = squareOAuthUrl();
      const redirectUri = `${supabaseUrl}/functions/v1/square-oauth?action=callback`;
      const authorizeUrl = `${oauthBase}/oauth2/authorize?client_id=${appId}&scope=${SCOPES}&session=false&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;

      return redirect(authorizeUrl);
    }

    if (action === 'callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        const errorDesc = url.searchParams.get('error_description') ?? 'Authorization denied';
        return redirect(`${supabaseUrl.replace('.supabase.co', '.vercel.app')}/admin/partners/square-callback?error=${encodeURIComponent(errorDesc)}`);
      }

      if (!code || !state) return json({ error: 'Missing code or state' }, 400);

      // Verify state
      const { data: stateRecord } = await admin
        .from('square_webhook_events')
        .select('payload')
        .eq('event_id', `oauth_state_${state}`)
        .eq('event_type', 'oauth_state')
        .eq('processed', false)
        .single();

      if (!stateRecord) return json({ error: 'Invalid or expired state' }, 400);

      const partnerId = (stateRecord.payload as { partner_id: string }).partner_id;

      // Mark state as used
      await admin
        .from('square_webhook_events')
        .update({ processed: true })
        .eq('event_id', `oauth_state_${state}`);

      // Exchange code for tokens
      const tokenUrl = `${squareBaseUrl()}/oauth2/token`;
      const tokenRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: appId,
          client_secret: appSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${supabaseUrl}/functions/v1/square-oauth?action=callback`,
        }),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error('Token exchange failed:', errText);
        const siteUrl = Deno.env.get('SITE_URL') ?? 'https://unicorn.gives';
        return redirect(`${siteUrl}/admin/partners/square-callback?error=${encodeURIComponent('Token exchange failed')}`);
      }

      const tokenData = await tokenRes.json() as {
        access_token: string;
        refresh_token: string;
        expires_at: string;
        merchant_id: string;
        token_type: string;
      };

      // Fetch merchant locations
      const locRes = await fetch(`${squareBaseUrl()}/v2/locations`, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Square-Version': '2025-01-23',
        },
      });
      const locData = await locRes.json() as { locations?: Array<{ id: string; name: string; status: string }> };
      const locations = (locData.locations ?? []).filter((l) => l.status === 'ACTIVE');
      const locationIds = locations.map((l) => ({ id: l.id, name: l.name }));

      // Encrypt tokens
      const encAccessToken = await encrypt(tokenData.access_token, encryptionKey);
      const encRefreshToken = await encrypt(tokenData.refresh_token, encryptionKey);

      // Upsert connection
      await admin.from('square_connections').upsert({
        partner_id: partnerId,
        merchant_id: tokenData.merchant_id,
        location_ids: locationIds,
        location_id: locationIds[0]?.id ?? null,
        access_token: encAccessToken,
        refresh_token: encRefreshToken,
        token_expires_at: tokenData.expires_at,
        scopes: SCOPES.split('+'),
        environment: Deno.env.get('SQUARE_ENVIRONMENT') ?? 'production',
      }, { onConflict: 'partner_id' });

      // Ensure feature config exists
      await admin.from('square_feature_config').upsert({
        partner_id: partnerId,
      }, { onConflict: 'partner_id' });

      const siteUrl = Deno.env.get('SITE_URL') ?? 'https://unicorn.gives';
      return redirect(`${siteUrl}/admin/partners/square-callback?partner_id=${partnerId}&success=true`);
    }

    return json({ error: 'Unknown GET action' }, 400);
  }

  // ── POST: disconnect or refresh ──
  if (req.method === 'POST') {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ error: 'Missing authorization' }, 401);
    }

    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) return json({ error: 'Unauthorized' }, 401);

    // Verify editor role
    const { data: profile } = await userClient
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();

    if (!profile?.role || !['super_admin', 'partner_editor'].includes(profile.role)) {
      return json({ error: 'Forbidden' }, 403);
    }

    let body: { action: string; partner_id: string };
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    if (body.action === 'disconnect') {
      // Get the token to revoke
      const { data: conn } = await admin
        .from('square_connections')
        .select('access_token')
        .eq('partner_id', body.partner_id)
        .single();

      if (conn) {
        const token = await decrypt(conn.access_token, encryptionKey);
        // Revoke with Square
        await fetch(`${squareBaseUrl()}/oauth2/revoke`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: appId,
            access_token: token,
          }),
        });
      }

      await admin.from('square_connections').delete().eq('partner_id', body.partner_id);
      await admin.from('square_feature_config').delete().eq('partner_id', body.partner_id);
      await admin.from('square_bookings_cache').delete().eq('partner_id', body.partner_id);
      await admin.from('square_catalog_cache').delete().eq('partner_id', body.partner_id);
      await admin.from('square_subscriptions').delete().eq('partner_id', body.partner_id);

      return json({ success: true });
    }

    if (body.action === 'refresh') {
      const { data: conn } = await admin
        .from('square_connections')
        .select('refresh_token')
        .eq('partner_id', body.partner_id)
        .single();

      if (!conn) return json({ error: 'No connection found' }, 404);

      const refreshToken = await decrypt(conn.refresh_token, encryptionKey);

      const tokenRes = await fetch(`${squareBaseUrl()}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: appId,
          client_secret: appSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!tokenRes.ok) {
        return json({ error: 'Token refresh failed' }, 502);
      }

      const tokenData = await tokenRes.json() as {
        access_token: string;
        refresh_token: string;
        expires_at: string;
      };

      const encAccess = await encrypt(tokenData.access_token, encryptionKey);
      const encRefresh = await encrypt(tokenData.refresh_token, encryptionKey);

      await admin.from('square_connections').update({
        access_token: encAccess,
        refresh_token: encRefresh,
        token_expires_at: tokenData.expires_at,
      }).eq('partner_id', body.partner_id);

      return json({ success: true, expires_at: tokenData.expires_at });
    }

    return json({ error: 'Unknown action' }, 400);
  }

  return json({ error: 'Method not allowed' }, 405);
});
