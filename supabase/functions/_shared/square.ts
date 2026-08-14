/**
 * Shared Square API utilities for Edge Functions.
 */
import { decrypt, encrypt } from './crypto.ts';

/** Refresh once the access token is inside this window of expiring. */
const REFRESH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export function squareBaseUrl(): string {
  const env = Deno.env.get('SQUARE_ENVIRONMENT') ?? 'production';
  return env === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';
}

export function squareOAuthUrl(): string {
  const env = Deno.env.get('SQUARE_ENVIRONMENT') ?? 'production';
  return env === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';
}

/**
 * Decrypt the stored access token for a partner's Square connection.
 */
export async function getDecryptedToken(
  accessTokenCipher: string,
): Promise<string> {
  const encryptionKey = Deno.env.get('SQUARE_ENCRYPTION_KEY');
  if (!encryptionKey) throw new Error('SQUARE_ENCRYPTION_KEY not configured');
  return decrypt(accessTokenCipher, encryptionKey);
}

/* deno-lint-ignore-file no-explicit-any */

/**
 * Exchange the stored refresh token for a fresh access token and persist both.
 *
 * Square refresh tokens do not expire, so this succeeds even if the access
 * token lapsed weeks ago — which is what makes lazy refresh sufficient and a
 * scheduled job unnecessary.
 */
export async function refreshConnection(
  admin: any,
  partnerId: string,
): Promise<string | null> {
  const appId = Deno.env.get('SQUARE_APP_ID');
  const appSecret = Deno.env.get('SQUARE_APP_SECRET');
  const encryptionKey = Deno.env.get('SQUARE_ENCRYPTION_KEY');
  if (!appId || !appSecret || !encryptionKey) {
    console.error('refreshConnection: Square env vars not configured');
    return null;
  }

  const { data: conn } = await admin
    .from('square_connections')
    .select('refresh_token')
    .eq('partner_id', partnerId)
    .single();
  if (!conn?.refresh_token) return null;

  let refreshToken: string;
  try {
    refreshToken = await decrypt(conn.refresh_token, encryptionKey);
  } catch {
    console.error('refreshConnection: could not decrypt refresh token');
    return null;
  }

  const res = await fetch(`${squareBaseUrl()}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: appId,
      client_secret: appSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    console.error('refreshConnection: Square rejected refresh', res.status, await res.text());
    return null;
  }

  const tokenData = await res.json() as {
    access_token: string;
    refresh_token: string;
    expires_at: string;
  };

  await admin.from('square_connections').update({
    access_token: await encrypt(tokenData.access_token, encryptionKey),
    refresh_token: await encrypt(tokenData.refresh_token, encryptionKey),
    token_expires_at: tokenData.expires_at,
  }).eq('partner_id', partnerId);

  console.log('refreshConnection: refreshed, expires', tokenData.expires_at);
  return tokenData.access_token;
}

/**
 * Get a usable access token for a partner, refreshing it first if it is
 * expired or close to it. Returns null when there is no connection at all.
 *
 * Prefer this over `getDecryptedToken` — it is what keeps a connection alive
 * without anyone clicking anything.
 */
export async function getValidAccessToken(
  admin: any,
  partnerId: string,
): Promise<{ accessToken: string; locationId: string | null } | null> {
  const { data: conn } = await admin
    .from('square_connections')
    .select('access_token, location_id, token_expires_at')
    .eq('partner_id', partnerId)
    .single();
  if (!conn) return null;

  const expiresAt = conn.token_expires_at ? Date.parse(conn.token_expires_at) : NaN;
  const needsRefresh = Number.isNaN(expiresAt) || expiresAt - Date.now() < REFRESH_WINDOW_MS;

  if (needsRefresh) {
    const refreshed = await refreshConnection(admin, partnerId);
    if (refreshed) {
      return { accessToken: refreshed, locationId: conn.location_id };
    }
    // Refresh failed — fall through and try the stored token anyway rather
    // than hard-failing, since it may still have life left in it.
    console.warn('getValidAccessToken: refresh failed, falling back to stored token');
  }

  try {
    return {
      accessToken: await getDecryptedToken(conn.access_token),
      locationId: conn.location_id,
    };
  } catch {
    return null;
  }
}

/**
 * Pull the category/code out of a Square error body for safe client display.
 * Square's `detail` field can echo request contents, so it stays in the logs
 * only — callers get the code, which is enough to tell an expired token
 * (AUTHENTICATION_ERROR/UNAUTHORIZED) from a bad request.
 */
export function squareErrorCode(errText: string): string {
  try {
    const parsed = JSON.parse(errText) as {
      errors?: Array<{ category?: string; code?: string }>;
    };
    const first = parsed.errors?.[0];
    if (!first) return 'UNKNOWN';
    return [first.category, first.code].filter(Boolean).join('/') || 'UNKNOWN';
  } catch {
    return 'UNKNOWN';
  }
}

/**
 * Make an authenticated request to the Square API.
 */
export async function squareFetch(
  path: string,
  accessToken: string,
  options: RequestInit = {},
): Promise<Response> {
  const base = squareBaseUrl();
  return fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Square-Version': '2025-01-23',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

/**
 * Search subscriptions for a Square customer. Returns the raw subscription array.
 */
export async function searchSubscriptions(
  accessToken: string,
  customerId: string,
  locationId: string,
): Promise<Array<Record<string, unknown>>> {
  const res = await squareFetch('/v2/subscriptions/search', accessToken, {
    method: 'POST',
    body: JSON.stringify({
      query: {
        filter: {
          customer_ids: [customerId],
          location_ids: [locationId],
        },
      },
    }),
  });
  if (!res.ok) return [];
  const data = await res.json() as { subscriptions?: Array<Record<string, unknown>> };
  return data.subscriptions ?? [];
}

/**
 * Search bookings for a Square customer within a window.
 */
export async function searchBookings(
  accessToken: string,
  customerId: string,
  locationId: string,
  startAt?: string,
): Promise<Array<Record<string, unknown>>> {
  const start = startAt ?? new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();
  const res = await squareFetch('/v2/bookings/search', accessToken, {
    method: 'POST',
    body: JSON.stringify({
      query: {
        filter: {
          customer_filter: { customer_ids: [customerId] },
          location_filter: { location_ids: [locationId] },
          start_at_range: { start_at: start },
        },
      },
    }),
  });
  if (!res.ok) return [];
  const data = await res.json() as { bookings?: Array<Record<string, unknown>> };
  return data.bookings ?? [];
}

/**
 * Retrieve a single Square customer.
 */
export async function retrieveCustomer(
  accessToken: string,
  customerId: string,
): Promise<Record<string, unknown> | null> {
  const res = await squareFetch(`/v2/customers/${customerId}`, accessToken, { method: 'GET' });
  if (!res.ok) return null;
  const data = await res.json() as { customer?: Record<string, unknown> };
  return data.customer ?? null;
}

/**
 * Update subscription state: pause, resume, or cancel.
 */
export async function updateSubscriptionState(
  accessToken: string,
  subscriptionId: string,
  action: 'pause' | 'resume' | 'cancel',
): Promise<Response> {
  const endpoint = action === 'cancel'
    ? `/v2/subscriptions/${subscriptionId}/cancel`
    : `/v2/subscriptions/${subscriptionId}/actions`;
  const body = action === 'cancel'
    ? {}
    : {
        action: {
          type: action === 'pause' ? 'PAUSE' : 'RESUME',
          effective_date: new Date().toISOString().slice(0, 10),
        },
      };
  return squareFetch(endpoint, accessToken, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
