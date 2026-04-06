import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { LandingPageRenderer } from '@/components/partner/LandingPageRenderer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { SubTabs } from '@/components/layout/SubTabs';
import { useTheme, spacing } from '@/constants/theme';
import { SeoHead } from '@/components/SeoHead';
import { getDefaultDescription } from '@/lib/seo';
import { fetchPartnerSlugParams } from '@/lib/static-build-queries';

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

export async function generateStaticParams() {
  const fromDb = await fetchPartnerSlugParams();
  if (fromDb.length > 0) return fromDb;
  const { getPartnerStaticLandingParams } = await import('@/lib/partner-static-from-seed');
  return getPartnerStaticLandingParams();
}

export default function PartnerLanding() {
  const { colors } = useTheme();
  const { partnerSlug } = useLocalSearchParams<{ partnerSlug: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [defaultTabs, setDefaultTabs] = useState<PartnerTab[]>([]);
  const [firstPage, setFirstPage] = useState<PartnerPage | null>(null);
  const [landingPage, setLandingPage] = useState<Record<string, unknown> | null>(null);

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

      // Check for a published landing page
      const { data: lpData } = await supabase
        .from('partner_landing_pages')
        .select('*')
        .eq('partner_id', partnerData.id)
        .eq('status', 'published')
        .single();

      if (!cancelled && lpData) {
        setLandingPage(lpData as Record<string, unknown>);
        return; // skip tab-based content fetch
      }

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

  if (!partner) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SeoHead
          title={partnerSlug ? `Partner · ${partnerSlug}` : 'Partner'}
          description={getDefaultDescription()}
        />
        <AppHeader title="Partner" />
        <Text style={[styles.loading, { color: colors.neutralVariant }]}>Loading...</Text>
      </View>
    );
  }

  // Landing page mode — full marketing layout
  if (landingPage) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SeoHead
          title={partner.name}
          description={partner.description ?? undefined}
          imageUrl={landingPage.hero_image_url as string | undefined}
        />
        <AppHeader title={partner.name} />
        <ScrollView contentContainerStyle={styles.landingContent}>
          <LandingPageRenderer data={landingPage} partnerId={partner.id} />
        </ScrollView>
      </View>
    );
  }

  // Tab-based fallback — existing behavior
  const effectiveTabs = partner.tabs && partner.tabs.length > 0 ? partner.tabs : defaultTabs;
  const tabs = routes.partners.tabItems(partnerSlug, effectiveTabs);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SeoHead title={partner.name} description={partner.description ?? undefined} />
      <AppHeader title={partner.name} />
      {tabs.length > 0 && <SubTabs tabs={tabs} />}
      <Wrapper contentContainerStyle={styles.content}>
        <Container>
          {firstPage ? (
            <MarkdownRenderer content={firstPage.body} />
          ) : partner.description ? (
            <Text style={[styles.desc, { color: colors.neutral }]}>{partner.description}</Text>
          ) : null}
        </Container>
      </Wrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { padding: spacing.xxl, textAlign: 'center' },
  content: { padding: spacing.xl, paddingBottom: 40 },
  landingContent: { paddingBottom: 40 },
  desc: { fontSize: 15, lineHeight: 24 },
});
