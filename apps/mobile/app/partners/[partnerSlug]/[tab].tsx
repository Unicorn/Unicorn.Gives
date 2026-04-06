import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { SubTabs } from '@/components/layout/SubTabs';
import { useTheme, spacing } from '@/constants/theme';
import { SeoHead } from '@/components/SeoHead';
import { getPartnerStaticTabParams } from '@/lib/partner-static-from-seed';
import { getDefaultDescription } from '@/lib/seo';
import { fetchPartnerTabParams } from '@/lib/static-build-queries';

type PartnerTab = { label: string; slug: string; order: number };

interface Partner {
  id: string;
  name: string;
  description: string | null;
  tabs: PartnerTab[] | null;
  partner_type_id: string | null;
}

interface PartnerPage {
  title: string;
  body: string;
}

export async function generateStaticParams() {
  const fromDb = await fetchPartnerTabParams();
  return fromDb.length > 0 ? fromDb : getPartnerStaticTabParams();
}

export default function PartnerTab() {
  const { colors } = useTheme();
  const { partnerSlug, tab } = useLocalSearchParams<{ partnerSlug: string; tab: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [defaultTabs, setDefaultTabs] = useState<PartnerTab[]>([]);
  const [page, setPage] = useState<PartnerPage | null>(null);

  useEffect(() => {
    if (!partnerSlug) return;

    let cancelled = false;

    (async () => {
      const { data: partnerData } = await supabase
        .from('partners')
        .select('id, name, tabs, partner_type_id')
        .eq('slug', partnerSlug)
        .single();

      if (cancelled || !partnerData) return;

      setPartner(partnerData as Partner);

      const { data: typeData } = partnerData.partner_type_id
        ? await supabase.from('partner_types').select('default_tabs').eq('id', partnerData.partner_type_id).single()
        : { data: null };

      const resolvedDefaultTabs = (typeData?.default_tabs ?? []) as PartnerTab[];
      setDefaultTabs(resolvedDefaultTabs);

      const { data: p } = await supabase
        .from('partner_pages')
        .select('title, body')
        .eq('partner_id', partnerData.id)
        .eq('tab_slug', tab)
        .single();

      if (!cancelled && p) setPage(p as PartnerPage);
    })();

    return () => {
      cancelled = true;
    };
  }, [partnerSlug, tab]);

  if (!partner) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SeoHead
          title={partnerSlug && tab ? `${partnerSlug} · ${tab}` : 'Partner'}
          description={getDefaultDescription()}
        />
        <AppHeader title="Partner" />
        <Text style={[styles.loading, { color: colors.neutralVariant }]}>Loading...</Text>
      </View>
    );
  }

  const effectiveTabs = partner.tabs && partner.tabs.length > 0 ? partner.tabs : defaultTabs;
  const tabs = routes.partners.tabItems(partnerSlug, effectiveTabs);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SeoHead
        title={page?.title ? `${page.title} · ${partner.name}` : `${partner.name} · ${tab}`}
        description={partner.description ?? undefined}
      />
      <AppHeader title={partner.name} />
      {tabs.length > 0 && <SubTabs tabs={tabs} />}
      <Wrapper contentContainerStyle={styles.content}>
        <Container>
          {page ? (
            <MarkdownRenderer content={page.body} />
          ) : (
            <Text style={[styles.loading, { color: colors.neutralVariant }]}>No content for this tab yet.</Text>
          )}
        </Container>
      </Wrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { padding: spacing.xxl, textAlign: 'center' },
  content: { padding: spacing.xl, paddingBottom: 40 },
});
