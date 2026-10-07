/**
 * Build a route -> SEO metadata map for the static web export.
 *
 * Why this exists: `HydrationGate` in app/_layout.tsx renders null until the
 * client hydrates, which is what keeps React 19 from treating the inevitable
 * server/client structural mismatch as a fatal error. The side effect is that
 * nothing in the React tree renders during static export — including SeoHead —
 * so every exported page ships the same shell with no title and the site-wide
 * default description. Search engines and link unfurlers therefore see one page
 * repeated hundreds of times.
 *
 * Until the hydration strategy changes, this script collects real per-route
 * titles and descriptions from Supabase so `inject-static-meta.ts` can write
 * them into the exported HTML after `expo export` runs.
 *
 * Missing Supabase env is not fatal: an empty map is written and injection
 * becomes a no-op, so builds without credentials still succeed.
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'lib', 'route-meta-data.json');
const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL ?? 'https://unicorn.gives').replace(/\/$/, '');

export type RouteMeta = {
  title: string;
  description?: string;
  image?: string | null;
  /** Emitted as a ld+json script by inject-static-meta.ts. */
  jsonLd?: Record<string, unknown>;
};

function clean(s: unknown, max = 300): string | undefined {
  if (typeof s !== 'string') return undefined;
  const t = s
    .replace(/<[^>]+>/g, ' ')            // html tags
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // markdown links/images -> label
    .replace(/[#*_`>|]/g, ' ')           // markdown punctuation
    .replace(/&[a-z]+;/gi, ' ')          // entities
    .replace(/\s+/g, ' ')
    .trim();
  if (!t) return undefined;
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** Avoid "The Mane — Services · The Mane" when the title already names the partner. */
function withParent(title: string, parentName: string): string {
  const t = title.trim();
  return t.toLowerCase().includes(parentName.toLowerCase()) ? t : `${t} · ${parentName}`;
}

/**
 * LocalBusiness structured data built strictly from stored fields — nothing is
 * inferred or invented. `LocalBusiness` rather than a narrower type such as
 * HairSalon because partners differ and nothing in the data says which is which.
 */
function localBusinessJsonLd(
  slug: string,
  name: string,
  lp: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!lp) return undefined;
  const phone = clean(lp.contact_phone, 40);
  const email = clean(lp.contact_email, 120);
  const address = clean(lp.contact_address, 200);
  const social = (lp.social_links ?? {}) as Record<string, string>;
  const sameAs = [social.facebook, social.instagram, social.twitter, social.website].filter(
    (u): u is string => typeof u === 'string' && /^https?:\/\//.test(u),
  );

  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url: `${SITE_URL}/partners/${slug}`,
  };
  if (phone) node.telephone = phone;
  if (email) node.email = email;
  if (lp.hero_image_url) node.image = lp.hero_image_url;
  if (sameAs.length) node.sameAs = sameAs;
  if (address) {
    // "300 Lake George St, Lake George, MI 48633"
    const m = address.match(/^(.*),\s*([^,]+),\s*([A-Z]{2})\s+(\d{5})$/);
    node.address = m
      ? {
          '@type': 'PostalAddress',
          streetAddress: m[1].trim(),
          addressLocality: m[2].trim(),
          addressRegion: m[3],
          postalCode: m[4],
          addressCountry: 'US',
        }
      : { '@type': 'PostalAddress', streetAddress: address };
  }
  return node;
}

async function main() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const routes: Record<string, RouteMeta> = {};

  if (!/^https?:\/\//.test(url) || !key) {
    console.warn('[generate-route-meta] Supabase env not configured; writing empty map.');
    writeFileSync(outputPath, `${JSON.stringify({ routes }, null, 2)}\n`, 'utf-8');
    return;
  }

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  // Sections that aren't DB-backed still need a title; without one the exported
  // page has no <title> element at all.
  const STATIC_ROUTES: Record<string, RouteMeta> = {
    '/': { title: 'Home', description: undefined },
    '/home': { title: 'Home' },
    '/guides': { title: 'Guides', description: 'Step-by-step guides for common local tasks and services.' },
    '/government': { title: 'Government', description: 'Township, city, village and county government information.' },
    '/directory': { title: 'Directory', description: 'Local business and community directory.' },
    '/directory/contacts': { title: 'Contacts' },
    '/partners': { title: 'Partners' },
    '/bingo': { title: 'Bingo' },
    '/home/news': { title: 'News' },
    '/home/events': { title: 'Events' },
    '/home/history': { title: 'History' },
    '/home/community': { title: 'Community' },
    '/styleguide': { title: 'Style Guide' },
    '/+not-found': { title: 'Page Not Found' },
    '/sign-in': { title: 'Sign In' },
    '/sign-up': { title: 'Create an Account' },
  };

  const add = (path: string, meta: RouteMeta) => {
    if (!meta.title) return;
    routes[path] = meta;
  };

  // Partner landing pages + their tabs.
  const { data: partners } = await sb
    .from('partners')
    .select('id, slug, name, description')
    .eq('is_active', true);
  const { data: landing } = await sb
    .from('partner_landing_pages')
    .select(
      'partner_id, hero_subheadline, hero_image_url, about_body, contact_phone, contact_email, contact_address, social_links',
    )
    .eq('status', 'published');
  const landingByPartner = new Map((landing ?? []).map((l) => [String(l.partner_id), l]));

  for (const p of partners ?? []) {
    const lp = landingByPartner.get(String(p.id));
    add(`/partners/${p.slug}`, {
      title: String(p.name),
      description:
        clean(lp?.hero_subheadline) ?? clean(p.description) ?? clean(lp?.about_body, 200),
      image: (lp?.hero_image_url as string) ?? null,
      jsonLd: localBusinessJsonLd(String(p.slug), String(p.name), lp),
    });
  }

  // Partner tab pages carry the partner name plus the tab title.
  const { data: partnerPages } = await sb
    .from('partner_pages')
    .select('partner_id, tab_slug, title, body');
  const partnerById = new Map((partners ?? []).map((p) => [String(p.id), p]));
  for (const pg of partnerPages ?? []) {
    const parent = partnerById.get(String(pg.partner_id));
    if (!parent || !pg.tab_slug) continue;
    add(`/partners/${parent.slug}/${pg.tab_slug}`, {
      title: withParent(String(pg.title ?? pg.tab_slug), String(parent.name)),
      description: clean(pg.body, 200),
    });
  }

  // Guides, news, events.
  const { data: guides } = await sb
    .from('guides')
    .select('slug, title, description')
    .eq('status', 'published');
  for (const g of guides ?? []) {
    add(`/guides/${g.slug}`, { title: String(g.title), description: clean(g.description) });
  }

  const { data: news } = await sb
    .from('news')
    .select('slug, title, description, image_url')
    .eq('status', 'published');
  for (const n of news ?? []) {
    add(`/home/news/${n.slug}`, {
      title: String(n.title),
      description: clean(n.description),
      image: (n.image_url as string) ?? null,
    });
  }

  const { data: events } = await sb
    .from('events')
    .select('slug, title, description, image_url')
    .eq('status', 'published');
  for (const e of events ?? []) {
    add(`/home/events/${e.slug}`, {
      title: String(e.title),
      description: clean(e.description),
      image: (e.image_url as string) ?? null,
    });
  }

  // Government region pages.
  const { data: regions } = await sb
    .from('regions')
    .select('slug, name, type, parent_id, id')
    .eq('is_active', true);
  const regionById = new Map((regions ?? []).map((r) => [String(r.id), r]));

  /** region id -> "<county>/<municipality>" URL fragment, for nested content. */
  const regionPath = new Map<string, { path: string; name: string }>();

  for (const r of regions ?? []) {
    if (r.type === 'county') {
      add(`/government/${r.slug}`, { title: String(r.name) });
      regionPath.set(String(r.id), { path: String(r.slug), name: String(r.name) });
    } else if (r.parent_id) {
      const parent = regionById.get(String(r.parent_id));
      if (parent) {
        add(`/government/${parent.slug}/${r.slug}`, { title: `${r.name} · ${parent.name}` });
        regionPath.set(String(r.id), {
          path: `${parent.slug}/${r.slug}`,
          name: String(r.name),
        });
      }
    }
  }

  // Nested municipal content. Each table is fetched once and mapped by
  // region_id rather than queried per region.
  type NestedSpec = {
    table: string;
    segment: string;
    columns: string;
    status?: string;
    statusIn?: string[];
    title: (row: Record<string, unknown>, regionName: string) => string;
    description?: (row: Record<string, unknown>) => string | undefined;
  };

  const nested: NestedSpec[] = [
    {
      table: 'minutes',
      segment: 'minutes',
      columns: 'slug, title, region_id, status, body',
      // Routes are generated for both states (see slugsForRegionTable).
      statusIn: ['approved', 'pending'],
      title: (r, n) => `${r.title} · ${n}`,
      description: (r) => clean(r.body, 200),
    },
    {
      table: 'contacts',
      segment: 'contacts',
      columns: 'slug, name, role, region_id, status',
      status: 'published',
      title: (r, n) => `${r.name}${r.role ? `, ${r.role}` : ''} · ${n}`,
      description: (r) =>
        clean(`${r.name}${r.role ? ` — ${r.role}` : ''}`),
    },
    {
      table: 'ordinances',
      segment: 'ordinances',
      columns: 'slug, title, description, region_id, status',
      status: 'published',
      title: (r, n) => `${r.title} · ${n}`,
      description: (r) => clean(r.description),
    },
    {
      table: 'region_pages',
      segment: 'resources',
      columns: 'slug, title, description, region_id, status',
      status: 'published',
      title: (r, n) => `${r.title} · ${n}`,
      description: (r) => clean(r.description),
    },
    {
      table: 'municipal_documents',
      segment: 'documents',
      columns: 'slug, title, description, region_id, status',
      status: 'published',
      title: (r, n) => `${r.title} · ${n}`,
      description: (r) => clean(r.description),
    },
    {
      table: 'events',
      segment: 'events',
      columns: 'slug, title, description, region_id, status',
      status: 'published',
      title: (r, n) => `${r.title} · ${n}`,
      description: (r) => clean(r.description),
    },
  ];

  for (const spec of nested) {
    let q = sb.from(spec.table).select(spec.columns);
    if (spec.statusIn) q = q.in('status', spec.statusIn);
    else if (spec.status) q = q.eq('status', spec.status);
    const { data, error } = await q;
    if (error) {
      console.warn(`[generate-route-meta] ${spec.table}: ${error.message}`);
      continue;
    }
    let n = 0;
    for (const row of (data ?? []) as unknown as Record<string, unknown>[]) {
      const region = regionPath.get(String(row.region_id));
      const slug = String(row.slug ?? '').trim();
      if (!region || !slug) continue;
      add(`/government/${region.path}/${spec.segment}/${slug}`, {
        title: spec.title(row, region.name),
        description: spec.description?.(row),
      });
      n++;
    }
    console.log(`[generate-route-meta]   ${spec.segment}: ${n}`);
  }


  // Section landing pages and the fixed municipal pages (zoning, plans).
  const SECTION_LABELS: Record<string, string> = {
    contacts: 'Contacts',
    resources: 'Resources',
    minutes: 'Minutes',
    documents: 'Documents',
    events: 'Events',
    ordinances: 'Ordinances',
    elections: 'Elections',
  };
  const FIXED_PAGES: Record<string, string> = {
    zoning: 'Zoning',
    'master-plan': 'Master Plan',
    'recreation-plan': 'Recreation Plan',
  };
  for (const { path, name } of regionPath.values()) {
    if (!path.includes('/')) continue; // counties have no sub-sections
    for (const [seg, label] of Object.entries(SECTION_LABELS)) {
      add(`/government/${path}/${seg}`, { title: `${label} · ${name}` });
    }
    for (const [seg, label] of Object.entries(FIXED_PAGES)) {
      add(`/government/${path}/${seg}`, { title: `${label} · ${name}` });
    }
  }

  // Local history ("lore") pages are code-driven JSON, not database rows.
  try {
    const loreDir = join(__dirname, '..', 'data', 'lore');
    for (const file of readdirSync(loreDir)) {
      if (!file.endsWith('.json')) continue;
      const slug = file.replace(/\.json$/, '');
      const doc = JSON.parse(readFileSync(join(loreDir, file), 'utf-8')) as {
        title?: string;
        seo_description?: string;
      };
      if (doc.title) {
        add(`/home/history/${slug}`, {
          title: doc.title,
          description: clean(doc.seo_description ?? undefined),
        });
      }
    }
  } catch (err) {
    console.warn('[generate-route-meta] Lore pages unavailable:', (err as Error).message);
  }

  // DB-derived entries win over the static defaults.
  for (const [path, meta] of Object.entries(STATIC_ROUTES)) {
    if (!routes[path]) routes[path] = meta;
  }

  writeFileSync(outputPath, `${JSON.stringify({ routes }, null, 2)}\n`, 'utf-8');
  console.log(`[generate-route-meta] Wrote metadata for ${Object.keys(routes).length} routes.`);
}

main().catch((err) => {
  console.error('[generate-route-meta] Failed:', err);
  process.exit(1);
});
