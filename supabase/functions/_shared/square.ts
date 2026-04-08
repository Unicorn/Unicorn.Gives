/**
 * Shared Square API utilities for Edge Functions.
 */
import { decrypt } from './crypto.ts';

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
