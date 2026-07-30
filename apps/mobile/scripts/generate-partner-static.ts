/**
 * Parse partner slugs and tab routes from the committed Supabase seed migration
 * and write them to lib/partner-static-data.json, which the app imports for
 * static route params (see lib/partner-static-from-seed.ts).
 *
 * Runs under Node (tsx) as the first step of the `mobile:build` target. The
 * parsing lives here — not in app code — because reading the seed SQL needs
 * `fs`, which cannot be bundled for native or for Metro's static web render.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedSqlPath = join(__dirname, '..', '..', '..', 'supabase', 'migrations', '001_initial_schema.sql');
const outputPath = join(__dirname, '..', 'lib', 'partner-static-data.json');

function normalizeHornTab(partnerSlug: string, tabSlug: string): string {
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

function main() {
  if (!existsSync(seedSqlPath)) {
    console.error(`[generate-partner-static] Seed migration not found at ${seedSqlPath}`);
    process.exit(1);
  }

  const sql = readFileSync(seedSqlPath, 'utf-8');
  const partners = extractPartnersFromSeedSql(sql);

  if (partners.length === 0) {
    console.warn('[generate-partner-static] No partners parsed from seed SQL; writing empty data.');
  }

  writeFileSync(outputPath, `${JSON.stringify({ partners }, null, 2)}\n`, 'utf-8');
  console.log(`[generate-partner-static] Wrote ${partners.length} partners to ${outputPath}`);
}

main();
