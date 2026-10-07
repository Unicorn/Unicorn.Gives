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
const SSR_SAFE_PREFIXES = ['/partners', '/government'];

/**
 * Routes under the `(tabs)` group cannot be added here. Seeding them is not
 * enough: the Tabs navigator itself renders differently on the server than on
 * the client's first render, so `/guides` and `/home/news` still threw React
 * #418 with fully seeded data, while `/partners` and `/styleguide` — both
 * outside `(tabs)` — hydrated cleanly. Verified against production builds on
 * 2026-10-07. Top-level routes such as `/government` are not affected by this
 * and remain candidates once seeded.
 */

export function isSsrSafeRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return SSR_SAFE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
