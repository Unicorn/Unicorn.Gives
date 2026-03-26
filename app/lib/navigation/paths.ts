import type { Href } from 'expo-router';

/** Cast to Expo Router's typed href union (single choke point for dynamic paths). */
export function toHref(path: string): Href {
  return path as Href;
}

/** Normalize `Href` for string comparisons (e.g. SubTabs active state). */
export function hrefToPathString(href: Href): string {
  if (typeof href === 'string') return href;
  if (typeof href === 'object' && href !== null && 'pathname' in href) {
    return String((href as { pathname: string }).pathname);
  }
  return String(href);
}

// -----------------------------------------------------------------------------
// Static path strings — use for pathname checks, prefixes, and building dynamic URLs
// -----------------------------------------------------------------------------

export const paths = {
  home: '/',

  auth: {
    signIn: '/(auth)/sign-in',
    signUp: '/(auth)/sign-up',
    admin: '/(admin)',
  },

  help: { index: '/help' },
  lore: { index: '/lore' },
  news: { index: '/news' },
  events: { index: '/events' },

  region: { base: '/region' },
  partners: { base: '/partners' },
} as const;

/** Region stack segments under `/region/[regionSlug]/…` */
export const regionSubsegments = {
  minutes: 'minutes',
  ordinances: 'ordinances',
  contacts: 'contacts',
  elections: 'elections',
} as const;

export type RegionSubsegment =
  (typeof regionSubsegments)[keyof typeof regionSubsegments];

const REGION_DETAIL_RE = new RegExp(
  `/(?:${Object.values(regionSubsegments).join('|')})/[^/]+$`
);

export function isRegionStackDetailPath(pathname: string): boolean {
  return REGION_DETAIL_RE.test(pathname);
}

function enc(s: string): string {
  return encodeURIComponent(s);
}

// -----------------------------------------------------------------------------
// Route builders (prefer these over string templates in components)
// -----------------------------------------------------------------------------

export const routes = {
  home: () => toHref(paths.home),

  auth: {
    signIn: () => toHref(paths.auth.signIn),
    signUp: () => toHref(paths.auth.signUp),
    adminDashboard: () => toHref(paths.auth.admin),
  },

  help: {
    index: () => toHref(paths.help.index),
    guide: (slug: string) => toHref(`${paths.help.index}/${enc(slug)}`),
    withCategory: (category: string) =>
      toHref(`${paths.help.index}?category=${enc(category)}`),
  },

  lore: {
    index: () => toHref(paths.lore.index),
    detail: (slug: string) => toHref(`${paths.lore.index}/${enc(slug)}`),
  },

  news: {
    index: () => toHref(paths.news.index),
    detail: (slug: string) => toHref(`${paths.news.index}/${enc(slug)}`),
  },

  events: {
    index: () => toHref(paths.events.index),
    detail: (slug: string) => toHref(`${paths.events.index}/${enc(slug)}`),
  },

  partners: {
    index: (partnerSlug: string) =>
      toHref(`${paths.partners.base}/${enc(partnerSlug)}`),
    tab: (partnerSlug: string, tabSlug: string) =>
      toHref(`${paths.partners.base}/${enc(partnerSlug)}/${enc(tabSlug)}`),
    /**
     * Partner landing uses `/partners/:slug`; additional tabs use `/partners/:slug/:tab`.
     */
    tabItems: (
      partnerSlug: string,
      tabs: { label: string; slug: string; order: number }[]
    ): { label: string; href: Href }[] => {
      const sorted = [...tabs].sort((a, b) => a.order - b.order);
      return sorted.map((t, i) => ({
        label: t.label,
        href:
          i === 0
            ? routes.partners.index(partnerSlug)
            : routes.partners.tab(partnerSlug, t.slug),
      }));
    },
  },

  region: {
    root: (regionSlug: string) =>
      toHref(`${paths.region.base}/${enc(regionSlug)}`),

    minutes: {
      index: (regionSlug: string) =>
        toHref(
          `${paths.region.base}/${enc(regionSlug)}/${regionSubsegments.minutes}`
        ),
      detail: (regionSlug: string, minuteSlug: string) =>
        toHref(
          `${paths.region.base}/${enc(regionSlug)}/${regionSubsegments.minutes}/${enc(minuteSlug)}`
        ),
    },

    ordinances: {
      index: (regionSlug: string) =>
        toHref(
          `${paths.region.base}/${enc(regionSlug)}/${regionSubsegments.ordinances}`
        ),
      detail: (regionSlug: string, ordinanceSlug: string) =>
        toHref(
          `${paths.region.base}/${enc(regionSlug)}/${regionSubsegments.ordinances}/${enc(ordinanceSlug)}`
        ),
    },

    contacts: {
      index: (regionSlug: string) =>
        toHref(
          `${paths.region.base}/${enc(regionSlug)}/${regionSubsegments.contacts}`
        ),
      detail: (regionSlug: string, contactSlug: string) =>
        toHref(
          `${paths.region.base}/${enc(regionSlug)}/${regionSubsegments.contacts}/${enc(contactSlug)}`
        ),
    },

    elections: {
      index: (regionSlug: string) =>
        toHref(
          `${paths.region.base}/${enc(regionSlug)}/${regionSubsegments.elections}`
        ),
      detail: (regionSlug: string, electionSlug: string) =>
        toHref(
          `${paths.region.base}/${enc(regionSlug)}/${regionSubsegments.elections}/${enc(electionSlug)}`
        ),
    },

    /** Sub-navigation tabs for the region stack (Overview, Minutes, …). */
    subNavTabs: (regionSlug: string): { label: string; href: Href }[] => {
      const r = enc(regionSlug);
      const base = `${paths.region.base}/${r}`;
      return [
        { label: 'Overview', href: toHref(base) },
        {
          label: 'Minutes',
          href: toHref(`${base}/${regionSubsegments.minutes}`),
        },
        {
          label: 'Ordinances',
          href: toHref(`${base}/${regionSubsegments.ordinances}`),
        },
        {
          label: 'Contacts',
          href: toHref(`${base}/${regionSubsegments.contacts}`),
        },
        {
          label: 'Elections',
          href: toHref(`${base}/${regionSubsegments.elections}`),
        },
      ];
    },
  },
} as const;

// -----------------------------------------------------------------------------
// Active-state helpers (drawer, tabs)
// -----------------------------------------------------------------------------

export function isPathActive(pathname: string, href: Href): boolean {
  const target = href as string;
  if (target === paths.home) {
    return pathname === paths.home;
  }
  return pathname === target || pathname.startsWith(`${target}/`);
}
