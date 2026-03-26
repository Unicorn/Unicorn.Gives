import type { Href } from 'expo-router';

export function toHref(path: string): Href {
  return path as Href;
}

export function hrefToPathString(href: Href): string {
  if (typeof href === 'string') return href;
  if (typeof href === 'object' && href !== null && 'pathname' in href) {
    return String((href as { pathname: string }).pathname);
  }
  return String(href);
}

export const paths = {
  home: '/',
  auth: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    admin: '/admin',
  },
  solve: { index: '/solve' },
  lore: { index: '/lore' },
  news: { index: '/news' },
  events: { index: '/events' },
  county: { base: '/county' },
  partners: { base: '/partners' },
  cms: {
    board: '/board',
    elections: '/elections',
    contacts: '/contacts',
  },
} as const;

export type MunicipalSegment = 'townships' | 'cities' | 'villages';

export const municipalSubsegments = {
  minutes: 'minutes',
  ordinances: 'ordinances',
  contacts: 'contacts',
  elections: 'elections',
} as const;

export type MunicipalSubsegment =
  (typeof municipalSubsegments)[keyof typeof municipalSubsegments];

const MUNICIPAL_DETAIL_RE = new RegExp(
  '/county/[^/]+/(?:townships|cities|villages)/[^/]+/(?:' +
    Object.values(municipalSubsegments).join('|') +
    ')/[^/]+$'
);

export function isMunicipalStackDetailPath(pathname: string): boolean {
  return MUNICIPAL_DETAIL_RE.test(pathname);
}

export function isRegionStackDetailPath(pathname: string): boolean {
  return isMunicipalStackDetailPath(pathname);
}

function enc(s: string): string {
  return encodeURIComponent(s);
}

function municipalEntityBase(
  countySlug: string,
  segment: MunicipalSegment,
  municipalSlug: string
) {
  return paths.county.base + '/' + enc(countySlug) + '/' + segment + '/' + enc(municipalSlug);
}

export const routes = {
  home: () => toHref(paths.home),
  auth: {
    signIn: () => toHref(paths.auth.signIn),
    signUp: () => toHref(paths.auth.signUp),
    adminDashboard: () => toHref(paths.auth.admin),
  },
  cms: {
    board: () => toHref(paths.cms.board),
    elections: () => toHref(paths.cms.elections),
    contacts: () => toHref(paths.cms.contacts),
  },
  solve: {
    index: () => toHref(paths.solve.index),
    flow: (flowSlug: string) => toHref(paths.solve.index + '/' + enc(flowSlug)),
    withCategory: (category: string) =>
      toHref(paths.solve.index + '?category=' + enc(category)),
  },
  lore: {
    index: () => toHref(paths.lore.index),
    detail: (slug: string) => toHref(paths.lore.index + '/' + enc(slug)),
  },
  news: {
    index: () => toHref(paths.news.index),
    detail: (slug: string) => toHref(paths.news.index + '/' + enc(slug)),
  },
  events: {
    index: () => toHref(paths.events.index),
    detail: (slug: string) => toHref(paths.events.index + '/' + enc(slug)),
  },
  partners: {
    index: (partnerSlug: string) =>
      toHref(paths.partners.base + '/' + enc(partnerSlug)),
    tab: (partnerSlug: string, tabSlug: string) =>
      toHref(paths.partners.base + '/' + enc(partnerSlug) + '/' + enc(tabSlug)),
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
  county: {
    root: (countySlug: string) => toHref(paths.county.base + '/' + enc(countySlug)),
    news: (countySlug: string) =>
      toHref(paths.county.base + '/' + enc(countySlug) + '/news'),
    events: (countySlug: string) =>
      toHref(paths.county.base + '/' + enc(countySlug) + '/events'),
    department: (countySlug: string, deptSlug: string) =>
      toHref(paths.county.base + '/' + enc(countySlug) + '/departments/' + enc(deptSlug)),
    townships: {
      index: (countySlug: string) =>
        toHref(paths.county.base + '/' + enc(countySlug) + '/townships'),
      municipalRoot: (countySlug: string, townshipSlug: string) =>
        toHref(municipalEntityBase(countySlug, 'townships', townshipSlug)),
    },
    cities: {
      index: (countySlug: string) =>
        toHref(paths.county.base + '/' + enc(countySlug) + '/cities'),
      municipalRoot: (countySlug: string, citySlug: string) =>
        toHref(municipalEntityBase(countySlug, 'cities', citySlug)),
    },
    villages: {
      index: (countySlug: string) =>
        toHref(paths.county.base + '/' + enc(countySlug) + '/villages'),
      municipalRoot: (countySlug: string, villageSlug: string) =>
        toHref(municipalEntityBase(countySlug, 'villages', villageSlug)),
    },
    municipal: {
      base: (countySlug: string, segment: MunicipalSegment, municipalSlug: string) =>
        toHref(municipalEntityBase(countySlug, segment, municipalSlug)),
      minutes: {
        index: (countySlug: string, segment: MunicipalSegment, municipalSlug: string) =>
          toHref(
            municipalEntityBase(countySlug, segment, municipalSlug) +
              '/' +
              municipalSubsegments.minutes
          ),
        detail: (
          countySlug: string,
          segment: MunicipalSegment,
          municipalSlug: string,
          minuteSlug: string
        ) =>
          toHref(
            municipalEntityBase(countySlug, segment, municipalSlug) +
              '/' +
              municipalSubsegments.minutes +
              '/' +
              enc(minuteSlug)
          ),
      },
      ordinances: {
        index: (countySlug: string, segment: MunicipalSegment, municipalSlug: string) =>
          toHref(
            municipalEntityBase(countySlug, segment, municipalSlug) +
              '/' +
              municipalSubsegments.ordinances
          ),
        detail: (
          countySlug: string,
          segment: MunicipalSegment,
          municipalSlug: string,
          ordinanceSlug: string
        ) =>
          toHref(
            municipalEntityBase(countySlug, segment, municipalSlug) +
              '/' +
              municipalSubsegments.ordinances +
              '/' +
              enc(ordinanceSlug)
          ),
      },
      contacts: {
        index: (countySlug: string, segment: MunicipalSegment, municipalSlug: string) =>
          toHref(
            municipalEntityBase(countySlug, segment, municipalSlug) +
              '/' +
              municipalSubsegments.contacts
          ),
        detail: (
          countySlug: string,
          segment: MunicipalSegment,
          municipalSlug: string,
          contactSlug: string
        ) =>
          toHref(
            municipalEntityBase(countySlug, segment, municipalSlug) +
              '/' +
              municipalSubsegments.contacts +
              '/' +
              enc(contactSlug)
          ),
      },
      elections: {
        index: (countySlug: string, segment: MunicipalSegment, municipalSlug: string) =>
          toHref(
            municipalEntityBase(countySlug, segment, municipalSlug) +
              '/' +
              municipalSubsegments.elections
          ),
        detail: (
          countySlug: string,
          segment: MunicipalSegment,
          municipalSlug: string,
          electionSlug: string
        ) =>
          toHref(
            municipalEntityBase(countySlug, segment, municipalSlug) +
              '/' +
              municipalSubsegments.elections +
              '/' +
              enc(electionSlug)
          ),
      },
      permits: (countySlug: string, segment: MunicipalSegment, municipalSlug: string) =>
        toHref(municipalEntityBase(countySlug, segment, municipalSlug) + '/permits'),
      zoning: (countySlug: string, segment: MunicipalSegment, municipalSlug: string) =>
        toHref(municipalEntityBase(countySlug, segment, municipalSlug) + '/zoning'),
      assessor: (countySlug: string, segment: MunicipalSegment, municipalSlug: string) =>
        toHref(municipalEntityBase(countySlug, segment, municipalSlug) + '/assessor'),
      fire: (countySlug: string, segment: MunicipalSegment, municipalSlug: string) =>
        toHref(municipalEntityBase(countySlug, segment, municipalSlug) + '/fire'),
      sad: (countySlug: string, segment: MunicipalSegment, municipalSlug: string) =>
        toHref(municipalEntityBase(countySlug, segment, municipalSlug) + '/sad'),
      community: (
        countySlug: string,
        segment: MunicipalSegment,
        municipalSlug: string,
        communitySlug: string
      ) =>
        toHref(
          municipalEntityBase(countySlug, segment, municipalSlug) +
            '/communities/' +
            enc(communitySlug)
        ),
      subNavTabs: (
        countySlug: string,
        segment: MunicipalSegment,
        municipalSlug: string
      ): { label: string; href: Href }[] => {
        const base = municipalEntityBase(countySlug, segment, municipalSlug);
        return [
          { label: 'Overview', href: toHref(base) },
          { label: 'Minutes', href: toHref(base + '/' + municipalSubsegments.minutes) },
          { label: 'Ordinances', href: toHref(base + '/' + municipalSubsegments.ordinances) },
          { label: 'Contacts', href: toHref(base + '/' + municipalSubsegments.contacts) },
          { label: 'Elections', href: toHref(base + '/' + municipalSubsegments.elections) },
          { label: 'Permits', href: toHref(base + '/permits') },
          { label: 'Zoning', href: toHref(base + '/zoning') },
        ];
      },
    },
  },
} as const;

export function isPathActive(pathname: string, href: Href): boolean {
  const target = href as string;
  if (target === paths.home) {
    return pathname === paths.home;
  }
  return pathname === target || pathname.startsWith(target + '/');
}

export const regionSubsegments = municipalSubsegments;
export type RegionSubsegment = MunicipalSubsegment;