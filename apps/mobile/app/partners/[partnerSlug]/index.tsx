import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { AppHeader } from '@/components/layout/AppHeader';
import { SubTabs } from '@/components/layout/SubTabs';

type PartnerTab = { label: string; slug: string; order: number };

interface Partner {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tabs: PartnerTab[] | null;
  partner_type_id: string | null;
}

interface PartnerPage {
  slug: string;
  title: string;
  body: string;
  tab_slug: string | null;
}

const SEED_SQL_PATH_CANDIDATES = [
  'supabase/migrations/001_initial_schema.sql',
  '../../supabase/migrations/001_initial_schema.sql',
  '../../../supabase/migrations/001_initial_schema.sql',
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
      // Handle escaped single-quote in SQL strings: ''.
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

      const tabSlugs = tabsParsed.map((t) => t.slug).filter(Boolean).map((s) => normalizeHornTab(partnerSlug, s));

      return { partnerSlug, tabSlugs };
    })
    .filter(Boolean) as PartnerStaticInfo[];
}

export function generateStaticParams() {
  const sql = loadSeedSql();
  if (!sql) return [];

  const partners = extractPartnersFromSeedSql(sql);

  // Landing route needs only `{ partnerSlug }`.
  const seen = new Set<string>();
  const out: { partnerSlug: string }[] = [];

  for (const p of partners) {
    if (seen.has(p.partnerSlug)) continue;
    seen.add(p.partnerSlug);
    out.push({ partnerSlug: p.partnerSlug });
  }

  return out;
}

export default function PartnerLanding() {
  const { partnerSlug } = useLocalSearchParams<{ partnerSlug: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [defaultTabs, setDefaultTabs] = useState<PartnerTab[]>([]);
  const [firstPage, setFirstPage] = useState<PartnerPage | null>(null);

  useEffect(() => {
    if (!partnerSlug) return;

    let cancelled = false;

    (async () => {
      const { data: partnerData } = await supabase
        .from('partners')
        .select('id, slug, name, description, tabs, partner_type_id')
        .eq('slug', partnerSlug)
        .single();

      if (cancelled || !partnerData) return;

      setPartner(partnerData as Partner);

      const { data: typeData } = partnerData.partner_type_id
        ? await supabase.from('partner_types').select('default_tabs').eq('id', partnerData.partner_type_id).single()
        : { data: null };

      const resolvedDefaultTabs = (typeData?.default_tabs ?? []) as PartnerTab[];
      setDefaultTabs(resolvedDefaultTabs);

      const effectiveTabs =
        partnerData.tabs && partnerData.tabs.length > 0 ? partnerData.tabs : resolvedDefaultTabs;
      const firstTab = effectiveTabs?.[0]?.slug || 'about';

      const { data: page } = await supabase
        .from('partner_pages')
        .select('*')
        .eq('partner_id', partnerData.id)
        .eq('tab_slug', firstTab)
        .single();

      if (!cancelled && page) setFirstPage(page as PartnerPage);
    })();

    return () => {
      cancelled = true;
    };
  }, [partnerSlug]);

  if (!partner) return <View style={styles.container}><AppHeader title="Partner" /><Text style={styles.loading}>Loading...</Text></View>;

  const effectiveTabs = partner.tabs && partner.tabs.length > 0 ? partner.tabs : defaultTabs;
  const tabs = routes.partners.tabItems(partnerSlug, effectiveTabs);

  return (
    <View style={styles.container}>
      <AppHeader title={partner.name} />
      {tabs.length > 0 && <SubTabs tabs={tabs} />}
      <ScrollView contentContainerStyle={styles.content}>
        {firstPage ? (
          <MarkdownRenderer content={firstPage.body} />
        ) : partner.description ? (
          <Text style={styles.desc}>{partner.description}</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  desc: { fontSize: 15, color: '#43493e', lineHeight: 24 },
});
