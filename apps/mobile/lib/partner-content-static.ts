/**
 * Build-time snapshot of partner landing content, used to seed the first
 * render so the static export ships real HTML. See
 * scripts/generate-partner-content.ts.
 */
import data from './partner-content-data.json';

type Snapshot = {
  partner: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    tabs: unknown;
    partner_type_id: string | null;
  };
  landingPage: Record<string, unknown> | null;
  /** Tab pages keyed by tab slug. */
  pages?: Record<string, { title: string; body: string }>;
  /** The partner type's default tabs, used when the partner defines none. */
  defaultTabs?: unknown;
};

const partners = (data as { partners: Record<string, Snapshot> }).partners ?? {};

export function getStaticPartner(slug: string | undefined): Snapshot | null {
  if (!slug) return null;
  return partners[slug] ?? null;
}
