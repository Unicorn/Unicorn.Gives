import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { AppHeader } from '@/components/layout/AppHeader';

interface CmsPage {
  title: string;
  description: string | null;
  body: string;
}

/**
 * Pre-render CMS pages for static web export.
 *
 * We no longer require `content/pages/*.md` to exist at build time.
 * Instead, we derive the slug list from the Supabase seed SQL.
 */
const SEED_SQL_PATH_CANDIDATES = [
  // when building from repo root
  'supabase/migrations/002_seed_content.sql',
  // when building from apps/mobile
  '../../supabase/migrations/002_seed_content.sql',
  // extra fallback (some tooling may set different cwd)
  '../../../supabase/migrations/002_seed_content.sql',
];

function loadSeedSql(): string | null {
  // Node-only.
  if (typeof window !== 'undefined') return null;

  const fs = require('fs') as typeof import('fs');
  const path = require('path') as typeof import('path');

  for (const rel of SEED_SQL_PATH_CANDIDATES) {
    const p = path.join(process.cwd(), rel);
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf-8');
  }
  return null;
}

function parseSqlTuples(valuesBlock: string): string[][] {
  // Parses a comma-separated list of tuples: (...) , (...) , ...
  // Each tuple value can be a single-quoted SQL string, NULL, boolean, number, or function like now().
  const tuples: string[][] = [];
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

    const values: string[] = [];
    while (i < s.length) {
      skipWs();
      if (s[i] === "'") {
        values.push(parseString());
      } else {
        values.push(parseToken());
      }

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
    if (s[i] === ',') i++;
  }

  return tuples;
}

let cachedSeedPageSlugs: string[] | null = null;
function getSeedPageSlugs(): string[] {
  if (cachedSeedPageSlugs) return cachedSeedPageSlugs;

  const sql = loadSeedSql();
  if (!sql) return [];

  const insertIdx = sql.indexOf('INSERT INTO public.pages');
  if (insertIdx === -1) return [];

  const valuesIdx = sql.indexOf('VALUES', insertIdx);
  if (valuesIdx === -1) return [];

  const endIdx = sql.indexOf('\n;\n\n', valuesIdx);
  const statementEnd = endIdx !== -1 ? endIdx + 3 : sql.length;

  const valuesBlock = sql.slice(valuesIdx + 'VALUES'.length, statementEnd).trim();
  const tuples = parseSqlTuples(valuesBlock);

  cachedSeedPageSlugs = tuples
    .filter((t) => t.length >= 1 && t[0])
    .map((t) => t[0])
    .filter(Boolean);

  return cachedSeedPageSlugs;
}

export function generateStaticParams() {
  const slugs = getSeedPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function GlobalCmsPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [page, setPage] = useState<CmsPage | null>(null);

  useEffect(() => {
    if (!slug) return;

    supabase
      .from('pages')
      .select('title, description, body')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        if (data) setPage(data as CmsPage);
        else setPage(null);
      });
  }, [slug]);

  const resolvedTitle = page?.title ?? slug?.replace(/-/g, ' ') ?? 'Page';

  if (!page) {
    return (
      <View style={styles.page}>
        <AppHeader title={resolvedTitle} />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.loading}>Loading…</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <AppHeader title={resolvedTitle} />
      <ScrollView contentContainerStyle={styles.content}>
        {page.description ? <Text style={styles.description}>{page.description}</Text> : null}
        <MarkdownRenderer content={page.body} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 40, gap: 12 },
  description: { fontSize: 14, color: '#73796d', lineHeight: 20 },
  loading: { paddingTop: 24, color: '#73796d', textAlign: 'center' },
});

