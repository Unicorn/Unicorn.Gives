/**
 * Snapshot published partner landing-page content to lib/partner-content-data.json.
 *
 * The page seeds its initial state from this snapshot so the static export
 * renders real content instead of an empty shell. Because both the server
 * render and the client's first render read the same bundled JSON, the first
 * render is deterministic — which is what hydration requires.
 *
 * Live data is still fetched on mount, so CMS edits appear immediately for
 * visitors and reach the pre-rendered HTML on the next build.
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'lib', 'partner-content-data.json');

async function main() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const out: { partners: Record<string, unknown> } = { partners: {} };

  if (/^https?:\/\//.test(url) && key) {
    const sb = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data: partners } = await sb
      .from('partners')
      .select('id, slug, name, description, tabs, partner_type_id')
      .eq('is_active', true);
    const { data: landing } = await sb
      .from('partner_landing_pages')
      .select('*')
      .eq('status', 'published');
    const byId = new Map((landing ?? []).map((l) => [String(l.partner_id), l]));
    // Tab pages and the type's default tabs, so /partners/<slug>/<tab> can
    // render its content at export time too.
    const { data: pages } = await sb.from('partner_pages').select('partner_id, tab_slug, title, body');
    const { data: types } = await sb.from('partner_types').select('id, default_tabs');
    const defaultTabsByType = new Map((types ?? []).map((t) => [String(t.id), t.default_tabs ?? []]));
    for (const p of partners ?? []) {
      out.partners[String(p.slug)] = {
        partner: {
          id: p.id,
          slug: p.slug,
          name: p.name,
          description: p.description ?? null,
          tabs: p.tabs ?? null,
          partner_type_id: p.partner_type_id ?? null,
        },
        landingPage: byId.get(String(p.id)) ?? null,
        pages: Object.fromEntries(
          (pages ?? [])
            .filter((pg) => String(pg.partner_id) === String(p.id) && pg.tab_slug)
            .map((pg) => [String(pg.tab_slug), { title: pg.title ?? '', body: pg.body ?? '' }]),
        ),
        defaultTabs: p.partner_type_id ? defaultTabsByType.get(String(p.partner_type_id)) ?? [] : [],
      };
    }
  } else {
    console.warn('[generate-partner-content] Supabase env not configured; empty snapshot.');
  }

  writeFileSync(outputPath, `${JSON.stringify(out, null, 2)}\n`, 'utf-8');
  console.log(
    `[generate-partner-content] Wrote ${Object.keys(out.partners).length} partners.`,
  );
}

main().catch((err) => {
  console.error('[generate-partner-content] Failed:', err);
  process.exit(1);
});
