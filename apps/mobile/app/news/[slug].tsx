import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

type NewsItem = {
  slug: string;
  title: string;
  description: string | null;
  body: string;
  date: string;
  author_name: string | null;
  category: string;
  image_url: string | null;
};

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
        const token = parseToken();
        values.push(token);
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

function loadSeedNewsItemsSync(): NewsItem[] {
  const sql = loadSeedSql();
  if (!sql) return [];

  // Find the `INSERT INTO public.news ... VALUES ...;` block.
  const insertIdx = sql.indexOf('INSERT INTO public.news');
  if (insertIdx === -1) return [];

  const valuesIdx = sql.indexOf('VALUES', insertIdx);
  if (valuesIdx === -1) return [];

  // The statement ends at the first `;\n\n` after VALUES block (works for our seed file).
  const endIdx = sql.indexOf('\n;\n', valuesIdx);
  const statementEnd = endIdx !== -1 ? endIdx + 3 : sql.length;
  const valuesBlock = sql.slice(valuesIdx + 'VALUES'.length, statementEnd).trim();

  // valuesBlock starts with newline and tuples: ('slug', 'title', ...), ('slug2', ...);
  const tuples = parseSqlTuples(valuesBlock);

  // Column order (from seed file):
  // (slug, title, description, body, date, author_name, category, source, source_url,
  //  featured, impact, image_url, visibility, status, created_at, published_at)
  return tuples
    .filter((t) => t.length >= 12 && t[0])
    .map((t) => ({
      slug: t[0],
      title: t[1],
      description: t[2] === 'NULL' ? null : t[2],
      body: t[3],
      date: t[4],
      author_name: t[5] === 'NULL' ? null : t[5],
      category: t[6],
      image_url: t[11] === 'NULL' ? null : t[11],
    }));
}

let cachedSeedNewsItems: NewsItem[] | null = null;
function getSeedNewsItems(): NewsItem[] {
  if (cachedSeedNewsItems) return cachedSeedNewsItems;
  cachedSeedNewsItems = loadSeedNewsItemsSync();
  return cachedSeedNewsItems;
}

function loadLocalNewsItemSync(slug: string): NewsItem | null {
  const items = getSeedNewsItems();
  return items.find((it) => it.slug === slug) ?? null;
}

export function generateStaticParams() {
  // Node-only; build-time SSG.
  const items = getSeedNewsItems();
  return items.map((it) => ({ slug: it.slug }));
}

export default function NewsDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const initialItem = useMemo(() => {
    if (!slug) return null;
    if (typeof window !== 'undefined') return null; // fs isn't available in browser
    return loadLocalNewsItemSync(slug);
  }, [slug]);

  const [item, setItem] = useState<NewsItem | null>(initialItem);

  useEffect(() => {
    if (!slug) return;
    // Avoid refetching on initial server/static render.
    if (item) return;
    supabase.from('news').select('*').eq('slug', slug).single()
      .then(({ data }) => { if (data) setItem(data); });
  }, [slug, item]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.category}>{item.category.replace(/-/g, ' ').toUpperCase()}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>
          {new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          {item.author_name ? ` · ${item.author_name}` : ''}
        </Text>
        <MarkdownRenderer content={item.body} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 60 },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  category: { fontSize: 11, fontWeight: '700', color: '#8a9a7c', letterSpacing: 1, marginBottom: 6 },
  title: { fontSize: 26, fontWeight: '800', color: '#2d4a4a', marginBottom: 8 },
  date: { fontSize: 14, color: '#73796d', marginBottom: 20 },
});
