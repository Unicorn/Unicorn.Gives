import { Platform } from 'react-native';

/**
 * Turn a stored path or URL into an absolute URL for Image / Linking (web-relative paths).
 */
export function resolveAbsoluteAssetUrl(pathOrUrl: string): string | null {
  const s = pathOrUrl.trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith('//')) return `https:${s}`;
  if (s.startsWith('/')) {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return `${window.location.origin}${s}`;
    }
    const origin =
      process.env.EXPO_PUBLIC_WEB_ORIGIN ?? process.env.EXPO_PUBLIC_SITE_URL ?? '';
    if (origin) {
      return `${String(origin).replace(/\/$/, '')}${s}`;
    }
  }
  return s;
}
