import { Platform } from 'react-native';
import { usePathname } from 'expo-router';
// Same Helmet instance as expo-router's Head.Provider (avoids duplicate titles on static export).
import { Helmet } from 'expo-router/vendor/react-helmet-async/lib/index.js';

import {
  absoluteUrl,
  getDefaultDescription,
  getPublicSiteUrl,
  getSiteName,
} from '@/lib/seo';

type SeoHeadProps = {
  title: string;
  description?: string;
  imageUrl?: string | null;
  /** When false, skip appending site name (title is already complete). */
  appendSiteName?: boolean;
  noIndex?: boolean;
};

function absoluteImage(url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = getPublicSiteUrl();
  if (!base) return undefined;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}

export function SeoHead({
  title,
  description,
  imageUrl,
  appendSiteName = true,
  noIndex = false,
}: SeoHeadProps) {
  const pathname = usePathname();

  // Helmet requires a HelmetProvider (web-only); skip on native to avoid crash.
  if (Platform.OS !== 'web') return null;
  const site = getSiteName();
  const pageTitle =
    !appendSiteName || title.includes(site) ? title : `${title} · ${site}`;
  const desc = (description ?? '').trim() || getDefaultDescription();
  const path = pathname?.startsWith('/') ? pathname : `/${pathname ?? ''}`;
  const url = absoluteUrl(path);
  const ogImage = absoluteImage(imageUrl ?? undefined);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : null}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      {url.startsWith('http') ? (
        <meta property="og:url" content={url} />
      ) : null}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site} />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      <meta
        name="twitter:card"
        content={ogImage ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}
