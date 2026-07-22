import type { MaterialIcons } from '@expo/vector-icons';

export const SITE_SETTINGS_KEY = 'feature_modules';

export const MODULE_KEYS = ['municipal', 'community', 'directory', 'games'] as const;
export type ModuleKey = (typeof MODULE_KEYS)[number];
export type ModuleFlags = Record<ModuleKey, boolean>;

export const DEFAULT_MODULE_FLAGS: ModuleFlags = {
  municipal: true,
  community: true,
  directory: true,
  games: true,
};

interface ModuleMeta {
  label: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  features: string[];
}

export const FEATURE_MODULES: Record<ModuleKey, ModuleMeta> = {
  municipal: {
    label: 'Municipal Government',
    description: 'Government tab, county & municipality pages, and all municipal admin tools.',
    icon: 'account-balance',
    features: [
      'Government tab',
      'Departments',
      'Boards & commissions',
      'Meetings & minutes',
      'Ordinances',
      'Elections',
      'Public notices',
      'Services & facilities',
      'Forms & documents',
      'Job postings',
      'FAQs',
      'Region pages',
      'Contacts',
    ],
  },
  community: {
    label: 'Community Content',
    description: 'Events, news (The Horn), and guides.',
    icon: 'menu-book',
    features: ['Events', 'News (The Horn)', 'Guides tab'],
  },
  directory: {
    label: 'Directory & Partners',
    description: 'Directory tab and partner microsites.',
    icon: 'contacts',
    features: ['Directory tab', 'Partner microsites', 'Partner pages'],
  },
  games: {
    label: 'Games',
    description: 'Community bingo games and boards.',
    icon: 'grid-view',
    features: ['Bingo games', 'Bingo boards'],
  },
};

/** Tolerant parse of the site_settings JSONB value; unknown/missing keys fall back to defaults. */
export function normalizeFlags(raw: unknown): ModuleFlags {
  const out = { ...DEFAULT_MODULE_FLAGS };
  if (raw && typeof raw === 'object') {
    for (const key of MODULE_KEYS) {
      const v = (raw as Record<string, unknown>)[key];
      if (typeof v === 'boolean') out[key] = v;
    }
  }
  return out;
}

/** Admin route prefixes owned by a module (used to filter admin nav and guard /admin/*). */
export const ADMIN_PATH_MODULES: Record<string, ModuleKey> = {
  '/admin/departments': 'municipal',
  '/admin/boards': 'municipal',
  '/admin/meetings': 'municipal',
  '/admin/minutes': 'municipal',
  '/admin/ordinances': 'municipal',
  '/admin/contacts': 'municipal',
  '/admin/elections': 'municipal',
  '/admin/municipal-documents': 'municipal',
  '/admin/region-pages': 'municipal',
  '/admin/public-notices': 'municipal',
  '/admin/services': 'municipal',
  '/admin/facilities': 'municipal',
  '/admin/forms-documents': 'municipal',
  '/admin/job-postings': 'municipal',
  '/admin/faqs': 'municipal',
  '/admin/events': 'community',
  '/admin/news': 'community',
  '/admin/guides': 'community',
  '/admin/partners': 'directory',
  '/admin/partner-pages': 'directory',
  '/admin/bingo-games': 'games',
  '/admin/bingo-boards': 'games',
};

export function moduleForAdminPath(pathname: string): ModuleKey | null {
  for (const [prefix, mod] of Object.entries(ADMIN_PATH_MODULES)) {
    // `prefix + '/'` so /admin/partner-pages never matches the /admin/partners prefix
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return mod;
  }
  return null;
}
