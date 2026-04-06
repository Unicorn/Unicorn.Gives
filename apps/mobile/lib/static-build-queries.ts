/**
 * Supabase reads used only from `generateStaticParams` and sitemap generation.
 * When env vars are missing, all functions return empty arrays so `expo export` still runs.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { LORE_ORDER } from '@/lib/lore';
// Lazily imported to avoid pulling Node's `fs` into the Metro bundle.
// Only used as a fallback inside collectPublicPathsForSitemap().
async function getPartnerStaticLandingParams() {
  const m = await import('@/lib/partner-static-from-seed');
  return m.getPartnerStaticLandingParams();
}
async function getPartnerStaticTabParams() {
  const m = await import('@/lib/partner-static-from-seed');
  return m.getPartnerStaticTabParams();
}
import { paths, routes, hrefToPathString } from '@/lib/navigation';
import { escapeXml } from '@/lib/seo';

function getBuildTimeClient(): SupabaseClient | null {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) return null;
  if (!key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export type CountyParam = { countySlug: string };
export type MunicipalityParam = { countySlug: string; municipalitySlug: string };
export type MunicipalSlugParam = MunicipalityParam & { slug: string };

export async function fetchCountySlugParams(): Promise<CountyParam[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const { data, error } = await sb
    .from('regions')
    .select('slug')
    .eq('type', 'county')
    .eq('is_active', true);

  if (error || !data?.length) return [];
  return data
    .map((r) => ({ countySlug: String(r.slug ?? '').trim() }))
    .filter((r) => r.countySlug.length > 0);
}

export async function fetchMunicipalityParams(): Promise<MunicipalityParam[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const { data: counties, error: cErr } = await sb
    .from('regions')
    .select('id, slug')
    .eq('type', 'county')
    .eq('is_active', true);

  if (cErr || !counties?.length) return [];

  const out: MunicipalityParam[] = [];

  for (const county of counties) {
    const { data: children, error: chErr } = await sb
      .from('regions')
      .select('slug')
      .eq('parent_id', county.id)
      .eq('is_active', true)
      .order('display_order');

    if (chErr || !children?.length) continue;
    const cSlug = String(county.slug ?? '').trim();
    if (!cSlug) continue;
    for (const m of children) {
      const mSlug = String(m.slug ?? '').trim();
      if (mSlug) out.push({ countySlug: cSlug, municipalitySlug: mSlug });
    }
  }

  return out;
}

async function slugsForRegionTable(
  table: 'minutes' | 'ordinances' | 'contacts' | 'elections',
  statusFilter: 'approved_pending' | 'published',
): Promise<MunicipalSlugParam[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const municipalities = await fetchMunicipalityParams();
  const out: MunicipalSlugParam[] = [];

  for (const { countySlug, municipalitySlug } of municipalities) {
    const { data: region, error: rErr } = await sb
      .from('regions')
      .select('id')
      .eq('slug', municipalitySlug)
      .maybeSingle();

    if (rErr || !region) continue;

    let q = sb.from(table).select('slug').eq('region_id', region.id);
    if (statusFilter === 'published') {
      q = q.eq('status', 'published');
    } else {
      q = q.in('status', ['approved', 'pending']);
    }

    const { data: rows, error } = await q;
    if (error || !rows?.length) continue;

    for (const row of rows) {
      const s = String(row.slug ?? '').trim();
      if (s) out.push({ countySlug, municipalitySlug, slug: s });
    }
  }

  return out;
}

export function fetchMinutesStaticParams(): Promise<MunicipalSlugParam[]> {
  return slugsForRegionTable('minutes', 'approved_pending');
}

export function fetchOrdinancesStaticParams(): Promise<MunicipalSlugParam[]> {
  return slugsForRegionTable('ordinances', 'published');
}

export function fetchContactsStaticParams(): Promise<MunicipalSlugParam[]> {
  return slugsForRegionTable('contacts', 'published');
}

export function fetchElectionsStaticParams(): Promise<MunicipalSlugParam[]> {
  return slugsForRegionTable('elections', 'published');
}

export async function fetchMunicipalDocumentsStaticParams(): Promise<MunicipalSlugParam[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const municipalities = await fetchMunicipalityParams();
  const out: MunicipalSlugParam[] = [];

  for (const { countySlug, municipalitySlug } of municipalities) {
    const { data: region, error: rErr } = await sb
      .from('regions')
      .select('id')
      .eq('slug', municipalitySlug)
      .maybeSingle();

    if (rErr || !region) continue;

    const { data: rows, error } = await sb
      .from('municipal_documents')
      .select('slug')
      .eq('region_id', region.id)
      .eq('status', 'published');

    if (error || !rows?.length) continue;
    for (const row of rows) {
      const s = String(row.slug ?? '').trim();
      if (s) out.push({ countySlug, municipalitySlug, slug: s });
    }
  }

  return out;
}

export async function fetchResourcePagesStaticParams(): Promise<MunicipalSlugParam[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const municipalities = await fetchMunicipalityParams();
  const out: MunicipalSlugParam[] = [];

  for (const { countySlug, municipalitySlug } of municipalities) {
    const { data: region, error: rErr } = await sb
      .from('regions')
      .select('id')
      .eq('slug', municipalitySlug)
      .maybeSingle();

    if (rErr || !region) continue;

    const { data: rows, error } = await sb
      .from('region_pages')
      .select('slug')
      .eq('region_id', region.id)
      .eq('category', 'resources')
      .eq('parent_slug', 'resources')
      .eq('status', 'published');

    if (error || !rows?.length) continue;
    for (const row of rows) {
      const s = String(row.slug ?? '').trim();
      if (s) out.push({ countySlug, municipalitySlug, slug: s });
    }
  }

  return out;
}

export async function fetchMunicipalEventsStaticParams(): Promise<MunicipalSlugParam[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const municipalities = await fetchMunicipalityParams();
  const out: MunicipalSlugParam[] = [];

  for (const { countySlug, municipalitySlug } of municipalities) {
    const { data: region, error: rErr } = await sb
      .from('regions')
      .select('id')
      .eq('slug', municipalitySlug)
      .maybeSingle();

    if (rErr || !region) continue;

    const { data: rows, error } = await sb
      .from('events')
      .select('slug')
      .eq('region_id', region.id)
      .eq('status', 'published');

    if (error || !rows?.length) continue;
    for (const row of rows) {
      const s = String(row.slug ?? '').trim();
      if (s) out.push({ countySlug, municipalitySlug, slug: s });
    }
  }

  return out;
}

export async function fetchHomeNewsSlugParams(): Promise<{ slug: string }[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const { data, error } = await sb
    .from('news')
    .select('slug')
    .eq('status', 'published')
    .in('visibility', ['global', 'both']);

  if (error || !data?.length) return [];
  return data
    .map((r) => ({ slug: String(r.slug ?? '').trim() }))
    .filter((r) => r.slug.length > 0);
}

export async function fetchHomeEventsSlugParams(): Promise<{ slug: string }[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const { data, error } = await sb
    .from('events')
    .select('slug')
    .eq('status', 'published')
    .in('visibility', ['global', 'both']);

  if (error || !data?.length) return [];
  return data
    .map((r) => ({ slug: String(r.slug ?? '').trim() }))
    .filter((r) => r.slug.length > 0);
}

export async function fetchGuideSlugParams(): Promise<{ slug: string }[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const { data, error } = await sb.from('guides').select('slug').eq('status', 'published');

  if (error || !data?.length) return [];
  return data
    .map((r) => ({ slug: String(r.slug ?? '').trim() }))
    .filter((r) => r.slug.length > 0);
}

export function fetchHistorySlugParams(): { slug: string }[] {
  return [...LORE_ORDER].map((slug) => ({ slug }));
}

/** Partner landing params — production data when Supabase is configured. */
export async function fetchPartnerSlugParams(): Promise<{ partnerSlug: string }[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const { data, error } = await sb
    .from('partners')
    .select('slug')
    .eq('is_active', true)
    .order('slug');

  if (error || !data?.length) return [];
  return data
    .map((r) => ({ partnerSlug: String(r.slug ?? '').trim() }))
    .filter((r) => r.partnerSlug.length > 0);
}

export type PartnerTabParam = { partnerSlug: string; tab: string };

export async function fetchPartnerTabParams(): Promise<PartnerTabParam[]> {
  const sb = getBuildTimeClient();
  if (!sb) return [];

  const { data: partners, error } = await sb
    .from('partners')
    .select('slug, tabs')
    .eq('is_active', true);

  if (error || !partners?.length) return [];

  const out: PartnerTabParam[] = [];

  for (const p of partners) {
    const slug = String(p.slug ?? '').trim();
    if (!slug) continue;
    const tabs = p.tabs as { slug: string }[] | null;
    if (!Array.isArray(tabs)) continue;
    for (const t of tabs) {
      const tab = String(t?.slug ?? '').trim();
      if (tab) out.push({ partnerSlug: slug, tab });
    }
  }

  return out;
}

const STATIC_INDEX_PATHS: string[] = [
  paths.home,
  paths.homeDiscover,
  paths.community.index,
  paths.community.events,
  paths.community.news,
  paths.history.index,
  paths.government.base,
  paths.partners.base,
  '/guides',
  '/directory',
  '/sign-in',
  '/sign-up',
];

/**
 * Collect relative URL paths for sitemap.xml (leading slash, no origin).
 */
export async function collectPublicPathsForSitemap(): Promise<string[]> {
  const seen = new Set<string>();

  const add = (path: string) => {
    const n = path.startsWith('/') ? path : `/${path}`;
    seen.add(n);
  };

  STATIC_INDEX_PATHS.forEach(add);

  for (const { slug } of fetchHistorySlugParams()) {
    add(hrefToPathString(routes.history.detail(slug)));
  }

  for (const { slug } of await fetchHomeNewsSlugParams()) {
    add(hrefToPathString(routes.community.news.detail(slug)));
  }

  for (const { slug } of await fetchHomeEventsSlugParams()) {
    add(hrefToPathString(routes.community.events.detail(slug)));
  }

  for (const { slug } of await fetchGuideSlugParams()) {
    add(`/guides/${encodeURIComponent(slug)}`);
  }

  for (const { countySlug } of await fetchCountySlugParams()) {
    add(hrefToPathString(routes.government.county(countySlug)));
  }

  for (const { countySlug, municipalitySlug } of await fetchMunicipalityParams()) {
    add(hrefToPathString(routes.government.municipality(countySlug, municipalitySlug)));
    add(hrefToPathString(routes.government.minutes.index(countySlug, municipalitySlug)));
    add(hrefToPathString(routes.government.ordinances.index(countySlug, municipalitySlug)));
    add(hrefToPathString(routes.government.contacts.index(countySlug, municipalitySlug)));
    add(hrefToPathString(routes.government.events.index(countySlug, municipalitySlug)));
    add(hrefToPathString(routes.government.elections.index(countySlug, municipalitySlug)));
    add(hrefToPathString(routes.government.documents.index(countySlug, municipalitySlug)));
    const base = hrefToPathString(routes.government.municipality(countySlug, municipalitySlug));
    add(`${base}/zoning`);
    add(`${base}/master-plan`);
    add(`${base}/recreation-plan`);
  }

  for (const row of await fetchMinutesStaticParams()) {
    add(
      hrefToPathString(
        routes.government.minutes.detail(row.countySlug, row.municipalitySlug, row.slug),
      ),
    );
  }
  for (const row of await fetchOrdinancesStaticParams()) {
    add(
      hrefToPathString(
        routes.government.ordinances.detail(row.countySlug, row.municipalitySlug, row.slug),
      ),
    );
  }
  for (const row of await fetchContactsStaticParams()) {
    add(
      hrefToPathString(
        routes.government.contacts.detail(row.countySlug, row.municipalitySlug, row.slug),
      ),
    );
  }
  for (const row of await fetchElectionsStaticParams()) {
    add(
      hrefToPathString(
        routes.government.elections.detail(row.countySlug, row.municipalitySlug, row.slug),
      ),
    );
  }
  for (const row of await fetchMunicipalEventsStaticParams()) {
    add(
      hrefToPathString(
        routes.government.events.detail(row.countySlug, row.municipalitySlug, row.slug),
      ),
    );
  }
  for (const row of await fetchMunicipalDocumentsStaticParams()) {
    add(
      hrefToPathString(
        routes.government.documents.detail(row.countySlug, row.municipalitySlug, row.slug),
      ),
    );
  }
  for (const row of await fetchResourcePagesStaticParams()) {
    // Add both the resources landing and each subpage
    add(
      hrefToPathString(
        routes.government.resources.index(row.countySlug, row.municipalitySlug),
      ),
    );
    add(
      hrefToPathString(
        routes.government.resources.detail(row.countySlug, row.municipalitySlug, row.slug),
      ),
    );
  }

  const partnersFromDb = await fetchPartnerSlugParams();
  const tabsFromDb = await fetchPartnerTabParams();
  const partners =
    partnersFromDb.length > 0 ? partnersFromDb : await getPartnerStaticLandingParams();
  const tabs = tabsFromDb.length > 0 ? tabsFromDb : await getPartnerStaticTabParams();

  for (const { partnerSlug } of partners) {
    add(hrefToPathString(routes.partners.index(partnerSlug)));
  }
  for (const { partnerSlug, tab } of tabs) {
    add(hrefToPathString(routes.partners.tab(partnerSlug, tab)));
  }

  return [...seen].sort();
}

export function buildSitemapXml(absoluteUrls: string[]): string {
  const urls = absoluteUrls
    .map((loc) => `  <url><loc>${escapeXml(loc)}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
