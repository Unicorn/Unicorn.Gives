/**
 * Routes whose first render is deterministic and may therefore render during
 * the hydration pass, putting real content into the exported HTML.
 *
 * A route qualifies only once it seeds its initial state from a build-time
 * snapshot (see scripts/generate-partner-content.ts). Adding a route here
 * before it does that reintroduces React error #418 on it, so extend this list
 * in step with the seeding work and verify against a production build — dev
 * builds do not reproduce hydration failures.
 */
const SSR_SAFE_PREFIXES = ['/partners'];

export function isSsrSafeRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return SSR_SAFE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
