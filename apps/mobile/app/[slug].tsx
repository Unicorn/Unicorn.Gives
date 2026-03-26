import { useEffect, useMemo, useState } from 'react';
import { Platform, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { AppHeader } from '@/components/layout/AppHeader';

interface CmsPage {
  title: string;
  description: string | null;
  body: string;
}

// Pre-render CMS pages for static web export using the repo-level markdown archive.
export function generateStaticParams() {
  // Node-only: expo export calls this during build.
  const fs = require('fs') as typeof import('fs');
  const path = require('path') as typeof import('path');

  function findContentPagesDir() {
    const candidates = [
      path.join(process.cwd(), 'content', 'pages'),
      path.join(process.cwd(), '..', 'content', 'pages'),
      path.join(process.cwd(), '..', '..', 'content', 'pages'),
      path.join(process.cwd(), '..', '..', '..', 'content', 'pages'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }
    throw new Error(`content/pages directory not found. Looked in: ${candidates.join(', ')}`);
  }

  const pagesDir = findContentPagesDir();
  const files = fs
    .readdirSync(pagesDir)
    .filter((f: string) => f.endsWith('.md') || f.endsWith('.mdx'));

  return files.map((f: string) => ({
    slug: f.replace(/\.mdx?$/, ''),
  }));
}

function loadLocalCmsPageSync(slug: string): CmsPage | null {
  // Only do local filesystem reads during server/static rendering.
  if (Platform.OS !== 'web') return null;
  if (typeof window !== 'undefined') return null;

  // Node-only: during expo export / SSR, this should be executed in Node.js.
  const fs = require('fs') as typeof import('fs');
  const path = require('path') as typeof import('path');

  const candidates = [
    path.join(process.cwd(), 'content', 'pages', `${slug}.md`),
    path.join(process.cwd(), '..', '..', 'content', 'pages', `${slug}.md`),
    path.join(process.cwd(), '..', 'content', 'pages', `${slug}.md`),
    path.join(process.cwd(), '..', '..', '..', 'content', 'pages', `${slug}.md`),
  ];

  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) return null;

  const markdown = fs.readFileSync(filePath, 'utf-8');

  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;
  const frontmatter = match[1];
  const body = match[2].trim();

  const getYamlString = (key: string) => {
    const re = new RegExp(`^${key}:\\s*(.+)$`, 'm');
    const m = frontmatter.match(re);
    if (!m) return null;
    let v = m[1].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    return v;
  };

  const title = getYamlString('title') ?? slug;
  const description = getYamlString('description') ?? null;
  return { title, description, body };
}

export default function GlobalCmsPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const initialPage = useMemo(() => (slug ? loadLocalCmsPageSync(slug) : null), [slug]);
  const [page, setPage] = useState<CmsPage | null>(initialPage);

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

  return (
    <View style={styles.page}>
      <AppHeader title={resolvedTitle} />
      <ScrollView contentContainerStyle={styles.content}>
        {page ? (
          <>
            {page.description ? (
              <Text style={styles.description}>{page.description}</Text>
            ) : null}
            <MarkdownRenderer content={page.body} />
          </>
        ) : (
          <Text style={styles.notFound}>No content found for this page.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 40, gap: 12 },
  description: { fontSize: 14, color: '#73796d', lineHeight: 20 },
  notFound: { paddingTop: 24, color: '#73796d', textAlign: 'center' },
});

