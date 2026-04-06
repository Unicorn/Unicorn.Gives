import { useEffect, useState } from 'react';
import { useWindowDimensions, Platform } from 'react-native';

/**
 * Returns `true` only after the first client-side render (after hydration).
 *
 * During Expo static export the server renders with no window dimensions,
 * so any component that branches on viewport width will produce HTML that
 * doesn't match the client's first render → React error #418.
 *
 * Use `isHydrated` to defer responsive logic until after mount.
 */
export function useIsHydrated(): boolean {
  const [hydrated, setHydrated] = useState(Platform.OS !== 'web');
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/**
 * Drop-in replacement for `useWindowDimensions` that is safe for SSR/static
 * export. Returns `{ width: 0, height: 0 }` on the very first server render
 * and during hydration, then the real dimensions once mounted.
 */
export function useHydratedDimensions() {
  const real = useWindowDimensions();
  const hydrated = useIsHydrated();
  if (!hydrated) return { width: 0, height: 0 };
  return real;
}
