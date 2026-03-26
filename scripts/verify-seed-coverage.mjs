/**
 * Verify that repo `content/` markdown sources are present in Supabase seed SQL.
 *
 * This is a read-only check meant to guarantee a "blank DB -> full DB" bootstrapping story.
 *
 * Usage:
 *   node scripts/verify-seed-coverage.mjs
 *
 * Behavior:
 * - Fails if any markdown slug under `content/{collection}/` is missing from the seed SQL.
 * - Does not fail when the seed has *extra* slugs (e.g. `content/` was deleted locally but
 *   `002_seed_content.sql` was not regenerated). In that case we only warn when the
 *   collection still has at least one markdown file.
 */
import { readdirSync, readFileSync } from 'fs';
import { join, extname, basename } from 'path';

const REPO_ROOT = join(import.meta.dirname, '..');

const SQL_002 =
  process.env.SEED_SQL_002 ?? join(REPO_ROOT, 'supabase', 'migrations', '002_seed_content.sql');
const SQL_004 =
  process.env.SEED_SQL_004 ?? join(REPO_ROOT, 'supabase', 'migrations', '004_upsert_pages_building_elections.sql');

function walkMarkdownFiles(dir) {
  const out = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const ent of entries) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...walkMarkdownFiles(p));
      continue;
    }
    const ext = extname(ent.name).toLowerCase();
    if (ext !== '.md' && ext !== '.mdx') continue;
    out.push(p);
  }

  return out;
}

function listSlugsFromDir(absDir) {
  const files = walkMarkdownFiles(absDir);
  return new Set(files.map((p) => basename(p, extname(p))));
}

function parseSqlTuples(valuesBlock) {
  // Parses a comma-separated list of tuples: (...) , (...) , ...
  // Each tuple value is either:
  // - a single-quoted SQL string (supports SQL-escaped quotes: '')
  // - or a token (numbers, NULL, function calls like now(), etc)
  const tuples = [];
  const s = valuesBlock;
  let i = 0;

  const skipWs = () => {
    while (i < s.length && /\s/.test(s[i])) i++;
  };

  const parseString = () => {
    // assumes s[i] === "'"
    i++; // skip opening quote
    let out = '';
    while (i < s.length) {
      const ch = s[i];
      if (ch === "'") {
        // escaped quote: ''
        if (s[i + 1] === "'") {
          out += "'";
          i += 2;
          continue;
        }
        i++; // skip closing quote
        break;
      }
      out += ch;
      i++;
    }
    return out;
  };

  const parseToken = () => {
    // Reads until a top-level comma or tuple-closing paren.
    // Needed because seed SQL includes function calls like `now()` which contain ')'.
    const start = i;
    let depth = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === '(') {
        depth++;
        i++;
        continue;
      }
      if (ch === ')') {
        if (depth === 0) break; // tuple close; don't consume
        depth--;
        i++;
        continue;
      }
      if (depth === 0 && ch === ',') break;
      i++;
    }
    return s.slice(start, i).trim();
  };

  while (i < s.length) {
    skipWs();
    if (s[i] !== '(') break;
    i++; // skip '('

    const values = [];
    while (i < s.length) {
      skipWs();
      if (s[i] === "'") values.push(parseString());
      else values.push(parseToken());

      skipWs();
      if (s[i] === ',') {
        i++; // skip comma
        continue;
      }
      if (s[i] === ')') {
        i++; // skip ')'
        break;
      }
    }

    tuples.push(values);
    skipWs();
    if (s[i] === ',') i++; // skip tuple separator
  }

  return tuples;
}

function extractInsertSlugs(sql, table, slugIndex) {
  const insertIdx = sql.indexOf(`INSERT INTO public.${table}`);
  if (insertIdx === -1) {
    throw new Error(`Could not find INSERT INTO public.${table} in ${table} seed SQL`);
  }

  const valuesIdx = sql.indexOf('VALUES', insertIdx);
  if (valuesIdx === -1) {
    throw new Error(`Could not find VALUES for public.${table}`);
  }

  const onConflictIdx = sql.indexOf('ON CONFLICT', valuesIdx);
  if (onConflictIdx === -1) {
    throw new Error(`Could not find ON CONFLICT for public.${table}`);
  }

  const valuesBlock = sql.slice(valuesIdx + 'VALUES'.length, onConflictIdx).trim();
  const tuples = parseSqlTuples(valuesBlock);

  return tuples
    .map((t) => t[slugIndex])
    .filter((v) => typeof v === 'string' && v.trim().length > 0);
}

function diffExpectedVsActual(expectedSet, actualSet) {
  const missing = [];
  for (const s of expectedSet) {
    if (!actualSet.has(s)) missing.push(s);
  }

  const unexpected = [];
  for (const s of actualSet) {
    if (!expectedSet.has(s)) unexpected.push(s);
  }

  missing.sort();
  unexpected.sort();
  return { missing, unexpected };
}

function main() {
  const contentRoot = join(REPO_ROOT, 'content');

  const expected = {
    contacts: listSlugsFromDir(join(contentRoot, 'contacts')),
    minutes: listSlugsFromDir(join(contentRoot, 'minutes')),
    ordinances: listSlugsFromDir(join(contentRoot, 'ordinances')),
    news: listSlugsFromDir(join(contentRoot, 'news')),
    events: listSlugsFromDir(join(contentRoot, 'events')),
    guides: listSlugsFromDir(join(contentRoot, 'guides')),
    pages: listSlugsFromDir(join(contentRoot, 'pages')),
  };

  const sql002 = readFileSync(SQL_002, 'utf-8');

  // slugIndex is 0-based inside each tuple for that INSERT statement.
  const actual002 = {
    contacts: new Set(extractInsertSlugs(sql002, 'contacts', 1)),
    minutes: new Set(extractInsertSlugs(sql002, 'minutes', 1)),
    ordinances: new Set(extractInsertSlugs(sql002, 'ordinances', 1)),
    news: new Set(extractInsertSlugs(sql002, 'news', 0)),
    events: new Set(extractInsertSlugs(sql002, 'events', 0)),
    guides: new Set(extractInsertSlugs(sql002, 'guides', 0)),
    pages: new Set(extractInsertSlugs(sql002, 'pages', 0)),
  };

  const failures = [];
  const warnings = [];
  for (const table of Object.keys(expected)) {
    const { missing, unexpected } = diffExpectedVsActual(expected[table], actual002[table]);

    if (missing.length > 0) {
      failures.push(`Table public.${table}:`);
      failures.push(`  Missing from seeds: ${missing.join(', ')}`);
    }

    // Extra rows in SQL without a matching markdown file: usually stale seed or empty `content/`.
    // Only warn when this collection still has sources, so we don't spam when `content/` is empty.
    if (unexpected.length > 0 && expected[table].size > 0) {
      warnings.push(
        `Table public.${table}: seed has ${unexpected.length} slug(s) not present under content/${table}/ (regenerate 002 or expected): ${unexpected.slice(0, 20).join(', ')}${unexpected.length > 20 ? '…' : ''}`,
      );
    }
  }

  // building/elections are not in `content/pages/`; they must be inserted via 004.
  const sql004 = readFileSync(SQL_004, 'utf-8');
  const hasBuilding = /\(\s*'building'\s*,/.test(sql004);
  const hasElections = /\(\s*'elections'\s*,/.test(sql004);

  if (!hasBuilding || !hasElections) {
    failures.push(
      `public.pages bootstrap: ${
        !hasBuilding && !hasElections
          ? 'missing building and elections'
          : !hasBuilding
            ? 'missing building'
            : 'missing elections'
      } in ${SQL_004}`,
    );
  }

  if (warnings.length > 0) {
    console.warn('Seed coverage warnings:\n' + warnings.map((l) => `- ${l}`).join('\n'));
  }

  if (failures.length > 0) {
    console.error('Seed coverage verification failed:\n' + failures.map((l) => `- ${l}`).join('\n'));
    process.exit(1);
  }

  console.log('Seed coverage verification passed.');
}

main();

