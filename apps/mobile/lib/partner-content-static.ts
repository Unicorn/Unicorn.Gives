/**
 * Build-time snapshot of partner landing content, used to seed the first
 * render so the static export ships real HTML. See
 * scripts/generate-partner-content.ts.
 */
// The JSON is deliberately NOT imported here. Route chunks are split per page on
// web, and a module imported by more than one route lands in the shared chunk
// every visitor downloads. The section's layout (one chunk) imports the data and
// registers it; pages read it through these accessors.

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

let partners: Record<string, Snapshot> = {};

/** Called once, at module scope, by app/partners/_layout.tsx. */
export function registerPartnerContent(data: unknown) {
  partners = (data as { partners?: Record<string, Snapshot> }).partners ?? {};
}

export function getStaticPartner(slug: string | undefined): Snapshot | null {
  if (!slug) return null;
  return partners[slug] ?? null;
}
