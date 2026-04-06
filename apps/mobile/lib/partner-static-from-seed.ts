/**
 * Parse partner slugs and tab routes from the committed Supabase seed migration
 * so `expo export` works without live Supabase (matches prior partner route behavior).
 */

const SEED_SQL_PATH_CANDIDATES = [
  'supabase/migrations/001_initial_schema.sql',
  '../../supabase/migrations/001_initial_schema.sql',
  '../../../supabase/migrations/001_initial_schema.sql',
];

export function loadPartnerSeedSql(): string | null {
  if (typeof window !== 'undefined') return null;

  // Dynamic require hidden from Metro's static analysis
  const nodeRequire = typeof require !== 'undefined' ? require : undefined;
  if (!nodeRequire) return null;
  const fs = nodeRequire(/* webpackIgnore: true */ 'f' + 's') as typeof import('fs');
  const path = nodeRequire(/* webpackIgnore: true */ 'pa' + 'th') as typeof import('path');

  for (const rel of SEED_SQL_PATH_CANDIDATES) {
    const p = path.join(process.cwd(), rel);
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf-8');
  }

  return null;
}

export function normalizeHornTab(partnerSlug: string, tabSlug: string): string {
  if (partnerSlug === 'the-horn' && tabSlug === 'hours-horn') return 'hours';
  return tabSlug;
}

type PartnerStaticInfo = { partnerSlug: string; tabSlugs: string[] };

function extractPartnersFromSeedSql(sql: string): PartnerStaticInfo[] {
  const insertIdx = sql.indexOf('INSERT INTO public.partners');
  if (insertIdx === -1) return [];

  const valuesIdx = sql.indexOf('VALUES', insertIdx);
  if (valuesIdx === -1) return [];

  const statementEnd = sql.indexOf(';', valuesIdx);
  if (statementEnd === -1) return [];

  const valuesBlock = sql.slice(valuesIdx + 'VALUES'.length, statementEnd).trim();

  const tuples: string[] = [];
  let inString = false;
  let depth = 0;
  let tupleStart: number | null = null;

  for (let i = 0; i < valuesBlock.length; i++) {
    const ch = valuesBlock[i];

    if (ch === "'") {
      if (inString && valuesBlock[i + 1] === "'") {
        i++;
        continue;
      }
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === '(') {
      if (depth === 0) tupleStart = i;
      depth++;
      continue;
    }

    if (ch === ')') {
      depth--;
      if (depth === 0 && tupleStart !== null) {
        tuples.push(valuesBlock.slice(tupleStart, i + 1));
        tupleStart = null;
      }
    }
  }

  return tuples
    .map((tupleStr) => {
      const slugMatch = tupleStr.match(/\('([^']*)'/);
      if (!slugMatch) return null;
      const partnerSlug = slugMatch[1];

      const tabsMatch = tupleStr.match(/'(\[[\s\S]*?\])'::jsonb\s*\)$/);
      if (!tabsMatch) return null;

      const tabsJson = tabsMatch[1];
      const tabsParsed = (() => {
        try {
          return JSON.parse(tabsJson) as { slug: string }[];
        } catch {
          return [];
        }
      })();

      const tabSlugs = tabsParsed
        .map((t) => t.slug)
        .filter(Boolean)
        .map((s) => normalizeHornTab(partnerSlug, s));

      return { partnerSlug, tabSlugs };
    })
    .filter(Boolean) as PartnerStaticInfo[];
}

export function getPartnerStaticLandingParams(): { partnerSlug: string }[] {
  const sql = loadPartnerSeedSql();
  if (!sql) return [];

  const partners = extractPartnersFromSeedSql(sql);
  const seen = new Set<string>();
  const out: { partnerSlug: string }[] = [];

  for (const p of partners) {
    if (seen.has(p.partnerSlug)) continue;
    seen.add(p.partnerSlug);
    out.push({ partnerSlug: p.partnerSlug });
  }

  return out;
}

export function getPartnerStaticTabParams(): { partnerSlug: string; tab: string }[] {
  const sql = loadPartnerSeedSql();
  if (!sql) return [];

  const partners = extractPartnersFromSeedSql(sql);
  const seen = new Set<string>();
  const out: { partnerSlug: string; tab: string }[] = [];

  for (const p of partners) {
    for (const tab of p.tabSlugs) {
      const key = `${p.partnerSlug}:${tab}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ partnerSlug: p.partnerSlug, tab });
    }
  }

  return out;
}
