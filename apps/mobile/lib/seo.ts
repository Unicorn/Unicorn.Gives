/**
 * Public site URL for canonical / Open Graph tags.
 * Set EXPO_PUBLIC_SITE_URL in production (no trailing slash), e.g. https://unicorn.gives
 */
export function getPublicSiteUrl(): string {
  const raw = process.env.EXPO_PUBLIC_SITE_URL ?? '';
  return raw.replace(/\/$/, '');
}

export function getSiteName(): string {
  return process.env.EXPO_PUBLIC_SITE_NAME?.trim() || 'UNI Gives';
}

export function getDefaultDescription(): string {
  return (
    process.env.EXPO_PUBLIC_SITE_DESCRIPTION?.trim() ||
    'Local civic hub for Michigan communities — events, news, government resources, and guides.'
  );
}

/** Absolute URL when EXPO_PUBLIC_SITE_URL is set; otherwise path only. */
export function absoluteUrl(path: string): string {
  const base = getPublicSiteUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
