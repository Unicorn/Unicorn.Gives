import type { Href } from 'expo-router';
import { routes } from './paths';

/**
 * High-level navigation groupings for drawers, tabs, and IA.
 * Pair with `routes` / `paths` from `./paths` for actual URLs.
 */
export type NavPillar = 'SOLVE' | 'GOVERN' | 'INFORM' | 'CONNECT';

export type NavLayer = 'root' | 'app-drawer' | 'region-tabs' | 'partner-tabs';

export interface NavNodeMeta {
  id: string;
  label: string;
  layer: NavLayer;
  /** When set, this item lives under an Expo Router group folder in the filesystem */
  fileGroup?: '(auth)' | '(admin)';
  pillar?: NavPillar;
  /** Lazily resolve href so dynamic routes stay in `routes` builders */
  getHref?: () => Href;
}

/** Root shell & primary drawer destinations (static). */
export const navigationTree: {
  root: NavNodeMeta;
  pillars: Record<
    NavPillar,
    { label: string; items: Omit<NavNodeMeta, 'layer'>[] }
  >;
} = {
  root: {
    id: 'home',
    label: 'Home',
    layer: 'root',
    getHref: routes.home,
  },
  pillars: {
    SOLVE: {
      label: 'SOLVE',
      items: [
        {
          id: 'help',
          label: 'Get Help',
          pillar: 'SOLVE',
          getHref: routes.help.index,
        },
      ],
    },
    GOVERN: {
      label: 'GOVERN',
      items: [
        {
          id: 'government-region',
          label: 'Government (per region)',
          pillar: 'GOVERN',
          // href is dynamic; DrawerMenu loads regions from Supabase
        },
      ],
    },
    INFORM: {
      label: 'INFORM',
      items: [
        {
          id: 'news',
          label: 'News & Alerts',
          pillar: 'INFORM',
          getHref: routes.news.index,
        },
        {
          id: 'events',
          label: 'Events Calendar',
          pillar: 'INFORM',
          getHref: routes.events.index,
        },
      ],
    },
    CONNECT: {
      label: 'CONNECT',
      items: [
        {
          id: 'partners',
          label: 'Partners (per slug)',
          pillar: 'CONNECT',
          // dynamic partner hrefs
        },
      ],
    },
  },
};

/** Auth screens (hidden from drawer). */
export const authNav = {
  signIn: { id: 'sign-in', getHref: routes.auth.signIn, fileGroup: '(auth)' as const },
  signUp: { id: 'sign-up', getHref: routes.auth.signUp, fileGroup: '(auth)' as const },
} as const;
