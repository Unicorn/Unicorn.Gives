/**
 * Shared helpers for post-auth redirects. Centralised so that both the route
 * guards (which *capture* the current path) and the auth screens (which
 * *consume* the redirect param) agree on what a safe target is — preventing
 * redirect loops (e.g. redirect back to /sign-in) and open redirects.
 */

/**
 * A redirect target is safe only if it's a local, in-app path that isn't an
 * auth screen. Blocks:
 * - non-strings / empty
 * - external URLs (must start with a single "/")
 * - protocol-relative URLs like "//evil.com"
 * - the auth screens themselves (would loop once the user is signed in)
 */
export function isSafeRedirect(path: string | null | undefined): path is string {
  return (
    typeof path === 'string' &&
    path.startsWith('/') &&
    !path.startsWith('//') &&
    !path.startsWith('/sign-in') &&
    !path.startsWith('/sign-up')
  );
}

/** Return `path` if it's a safe redirect target, otherwise `fallback`. */
export function safeRedirect(path: string | null | undefined, fallback = '/'): string {
  return isSafeRedirect(path) ? path : fallback;
}

/**
 * Build a `/sign-in` href that returns the user to `pathname` after auth.
 * Skips unsafe/auth paths so we never send them into a loop.
 */
export function signInHref(pathname: string | null | undefined): string {
  return isSafeRedirect(pathname) ? `/sign-in?redirect=${encodeURIComponent(pathname)}` : '/sign-in';
}
