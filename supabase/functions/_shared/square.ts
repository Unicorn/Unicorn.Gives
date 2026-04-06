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
