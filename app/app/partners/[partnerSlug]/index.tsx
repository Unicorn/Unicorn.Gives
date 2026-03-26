import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { AppHeader } from '@/components/layout/AppHeader';
import { SubTabs } from '@/components/layout/SubTabs';

interface Partner {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tabs: { label: string; slug: string; order: number }[] | null;
}

interface PartnerPage {
  slug: string;
  title: string;
  body: string;
  tab_slug: string | null;
}

export default function PartnerLanding() {
  const { partnerSlug } = useLocalSearchParams<{ partnerSlug: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [firstPage, setFirstPage] = useState<PartnerPage | null>(null);

  useEffect(() => {
    if (!partnerSlug) return;
    supabase.from('partners').select('*').eq('slug', partnerSlug).single()
      .then(({ data }) => {
        if (data) {
          setPartner(data);
          const firstTab = data.tabs?.[0]?.slug || 'about';
          supabase.from('partner_pages').select('*').eq('partner_id', data.id).eq('tab_slug', firstTab).single()
            .then(({ data: page }) => { if (page) setFirstPage(page); });
        }
      });
  }, [partnerSlug]);

  if (!partner) return <View style={styles.container}><AppHeader title="Partner" /><Text style={styles.loading}>Loading...</Text></View>;

  const tabs = routes.partners.tabItems(
    partnerSlug,
    partner.tabs || []
  );

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
