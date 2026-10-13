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
const SSR_SAFE_PREFIXES = ['/partners', '/government', '/guides', '/home', '/directory'];

/**
 * Routes under the `(tabs)` group were unroutable here until 2026-10-13. Two
 * things made the Tabs navigator's first render differ from the export: the
 * bottom tab bar reads the window frame (now hidden until hydration, see
 * app/(tabs)/_layout.tsx), and every MaterialIcons glyph rendered as an empty
 * <Text/> on the server because the icon font was not registered through
 * useFonts (see app/_layout.tsx). With both fixed, a `(tabs)` route qualifies
 * on the same terms as any other: seed its first render from a snapshot
 * (scripts/generate-community-snapshot.ts) and verify against a production
 * build — dev builds do not reproduce hydration failures.
 */

export function isSsrSafeRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return SSR_SAFE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
