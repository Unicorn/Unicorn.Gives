/**
 * Snapshot the community content that the `(tabs)` routes render — guides,
 * news, upcoming events, the home page's lists and the partner directory — to
 * lib/community-snapshot-data.json.
 *
 * Each page seeds its initial state from this file so the static export ships
 * real HTML and the client's first render matches it. Live data is still
 * fetched on mount, so CMS edits show immediately and reach the HTML on the
 * next build. Queries here mirror the pages' own queries exactly; "upcoming"
 * is relative to the build date, which is fine because the pages never filter
 * by date at render time — only in the query that replaces this seed.
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'lib', 'community-snapshot-data.json');

type Row = Record<string, unknown>;

async function main() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
  // No timestamp: the file is committed and must only change when content does.
  const out = {
    guides: { list: [] as Row[], bySlug: {} as Record<string, { guide: Row; contacts: Row[]; forms: Row[] }> },
    news: { list: [] as Row[], bySlug: {} as Record<string, Row> },
    events: { list: [] as Row[], bySlug: {} as Record<string, Row> },
    home: { regions: [] as Row[], news: [] as Row[], events: [] as Row[], partners: [] as Row[] },
    directory: { partners: [] as Row[] },
  };

  if (!/^https?:\/\//.test(url) || !key) {
    console.warn('[generate-community-snapshot] Supabase env not configured; empty snapshot.');
    writeFileSync(outputPath, `${JSON.stringify(out, null, 2)}\n`, 'utf-8');
    return;
  }

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const today = new Date().toISOString().split('T')[0];

  // Guides (index + every detail page with its contacts and forms).
  const { data: guides } = await sb
    .from('guides')
    .select('*')
    .eq('status', 'published')
    .order('title');
  const guideIds = (guides ?? []).map((g) => g.id);
  const [{ data: contacts }, { data: forms }] = await Promise.all([
    sb.from('guide_contacts').select('*').in('guide_id', guideIds),
    sb.from('guide_forms').select('*').in('guide_id', guideIds),
  ]);
  out.guides.list = (guides ?? []).map(
    ({ id, slug, title, description, category, icon, jurisdiction }) =>
      ({ id, slug, title, description, category, icon, jurisdiction }) as Row,
  );
  for (const g of guides ?? []) {
    out.guides.bySlug[String(g.slug)] = {
      guide: g as Row,
      contacts: (contacts ?? []).filter((c) => c.guide_id === g.id) as Row[],
      forms: (forms ?? []).filter((f) => f.guide_id === g.id) as Row[],
    };
  }

  // News.
  const { data: news } = await sb
    .from('news')
    .select(
      'id, slug, title, date, category, description, body, author_name, source, source_url, image_url, featured, visibility',
    )
    .eq('status', 'published')
    .order('date', { ascending: false })
    .limit(50);
  out.news.list = (news ?? []).map(
    ({ id, slug, title, date, category, description, image_url, featured }) =>
      ({ id, slug, title, date, category, description, image_url, featured }) as Row,
  );
  for (const n of news ?? []) {
    if (n.visibility === 'global' || n.visibility === 'both') {
      const { slug: _s, featured: _f, visibility: _v, ...row } = n;
      out.news.bySlug[String(n.slug)] = row as Row;
    }
  }

  // Events: the list is upcoming only; detail pages exist for every published event.
  const { data: upcoming } = await sb
    .from('events')
    .select('id, slug, title, description, date, time, location, category, recurring, tags, image_url, featured')
    .eq('status', 'published')
    .gte('date', today)
    .in('visibility', ['global', 'both'])
    .order('date')
    .limit(50);
  out.events.list = (upcoming ?? []) as Row[];
  const { data: allEvents } = await sb
    .from('events')
    .select(
      'id, slug, title, description, category, date, time, location, cost, recurring, recurrence_rule, body, image_url',
    )
    .eq('status', 'published');
  for (const e of allEvents ?? []) {
    const { slug, ...row } = e;
    out.events.bySlug[String(slug)] = row as Row;
  }

  // Home page lists and the directory.
  const [{ data: regions }, { data: homeNews }, { data: homeEvents }, { data: partners }] =
    await Promise.all([
      sb.from('regions').select('id, slug, name, type').eq('is_active', true).order('display_order'),
      sb
        .from('news')
        .select('slug, title, date, category, image_url')
        .eq('status', 'published')
        .in('visibility', ['global', 'both'])
        .order('date', { ascending: false })
        .limit(3),
      sb
        .from('events')
        .select('slug, title, date, time, location, image_url')
        .eq('status', 'published')
        .in('visibility', ['global', 'both'])
        .gte('date', today)
        .order('date')
        .limit(4),
      sb.from('partners').select('slug, name, description').eq('is_active', true),
    ]);
  out.home = {
    regions: (regions ?? []) as Row[],
    news: (homeNews ?? []) as Row[],
    events: (homeEvents ?? []) as Row[],
    partners: (partners ?? []) as Row[],
  };
  out.directory.partners = (partners ?? []) as Row[];

  writeFileSync(outputPath, `${JSON.stringify(out, null, 2)}\n`, 'utf-8');
  console.log(
    `[generate-community-snapshot] ${out.guides.list.length} guides, ${out.news.list.length} news, ` +
      `${out.events.list.length} upcoming events, ${Object.keys(out.events.bySlug).length} event pages.`,
  );
}

main().catch((err) => {
  console.error('[generate-community-snapshot] Failed:', err);
  process.exit(1);
});
