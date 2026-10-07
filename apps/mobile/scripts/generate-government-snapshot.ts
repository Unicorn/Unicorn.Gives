/**
 * Snapshot municipal content to lib/government-snapshot-data.json so the
 * `/government` routes can render server-side.
 *
 * Seeding makes a route's first render deterministic, which is the
 * precondition for listing it in lib/ssrRoutes.ts (see the note there about
 * `(tabs)`). Queries mirror the ones in the page components; if a component's
 * select or filters change, change them here too.
 *
 * Deliberate omissions:
 * - **Minutes bodies.** 139 rows with bodies is ~488KB (~30KB without), and it
 *   would ship in every page's bundle to pre-render 139 detail pages. Those
 *   pages still render their chrome and title server-side and fetch the body on
 *   mount; `item` is null on both the server and the client's first render, so
 *   hydration stays safe.
 * - **Upcoming events.** The query filters on `new Date()`, so a build-time
 *   result would disagree with the client whenever the build and the visit fall
 *   on different days. It stays client-only.
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'lib', 'government-snapshot-data.json');

type RegionBundle = {
  landing: unknown | null;
  stats: { minutes: number; ordinances: number; contacts: number; events: number };
  resourcePages: unknown[];
  minutesList: unknown[];
  ordinancesList: unknown[];
  ordinancesBySlug: Record<string, unknown>;
  contacts: unknown[];
};

async function main() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const out: {
    regionsBySlug: Record<string, unknown>;
    byRegionId: Record<string, RegionBundle>;
  } = { regionsBySlug: {}, byRegionId: {} };

  if (!/^https?:\/\//.test(url) || !key) {
    console.warn('[generate-government-snapshot] Supabase env not configured; empty snapshot.');
    writeFileSync(outputPath, `${JSON.stringify(out, null, 2)}\n`, 'utf-8');
    return;
  }

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data: regions } = await sb.from('regions').select('*').eq('is_active', true);
  if (!regions?.length) {
    console.warn('[generate-government-snapshot] No regions returned; empty snapshot.');
    writeFileSync(outputPath, `${JSON.stringify(out, null, 2)}\n`, 'utf-8');
    return;
  }

  const [landings, minutes, ordinances, contacts, regionPages, eventRows] = await Promise.all([
    sb.from('region_landing_pages').select('*').eq('status', 'published'),
    sb.from('minutes').select('id, slug, title, date, meeting_type, status, region_id'),
    sb.from('ordinances').select('*').eq('status', 'published'),
    sb
      .from('contacts')
      .select('id, name, role, department, phone, phone_ext, email, hours, region_id, display_order')
      .eq('status', 'published')
      .order('display_order'),
    sb.from('region_pages').select('*').eq('status', 'published'),
    sb.from('events').select('id, region_id').eq('status', 'published'),
  ]);

  const by = <T extends { region_id?: unknown }>(rows: T[] | null, id: string) =>
    (rows ?? []).filter((r) => String(r.region_id) === id);

  for (const region of regions) {
    const id = String(region.id);
    const slug = String(region.slug ?? '').trim();
    if (slug) out.regionsBySlug[slug] = region;

    const regionMinutes = by(minutes.data, id);
    const regionOrdinances = by(ordinances.data, id);
    const regionContacts = by(contacts.data, id);

    const ordinancesBySlug: Record<string, unknown> = {};
    for (const o of regionOrdinances) {
      const s = String((o as { slug?: unknown }).slug ?? '').trim();
      if (s) ordinancesBySlug[s] = o;
    }

    out.byRegionId[id] = {
      landing: (landings.data ?? []).find((l) => String(l.region_id) === id) ?? null,
      stats: {
        minutes: regionMinutes.length,
        ordinances: regionOrdinances.length,
        contacts: regionContacts.length,
        events: by(eventRows.data, id).length,
      },
      resourcePages: by(regionPages.data, id).filter(
        (r) =>
          (r as { category?: string }).category === 'resources' &&
          (r as { parent_slug?: string }).parent_slug === 'resources',
      ),
      // Sorted to match the components' `.order()` clauses so the seeded render
      // matches the fetched one.
      minutesList: [...regionMinutes].sort((a, b) =>
        String((b as { date?: string }).date ?? '').localeCompare(String((a as { date?: string }).date ?? '')),
      ),
      ordinancesList: [...regionOrdinances].sort((a, b) =>
        String((a as { number?: string }).number ?? '').localeCompare(
          String((b as { number?: string }).number ?? ''),
        ),
      ),
      ordinancesBySlug,
      contacts: regionContacts,
    };
  }

  writeFileSync(outputPath, `${JSON.stringify(out, null, 2)}\n`, 'utf-8');
  console.log(
    `[generate-government-snapshot] ${Object.keys(out.regionsBySlug).length} regions, ` +
      `${(minutes.data ?? []).length} minutes (no bodies), ` +
      `${(ordinances.data ?? []).length} ordinances, ${(contacts.data ?? []).length} contacts.`,
  );
}

main().catch((err) => {
  console.error('[generate-government-snapshot] Failed:', err);
  process.exit(1);
});
