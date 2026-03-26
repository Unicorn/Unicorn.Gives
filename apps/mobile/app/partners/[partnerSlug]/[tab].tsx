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
  name: string;
  tabs: { label: string; slug: string; order: number }[] | null;
}

interface PartnerPage {
  title: string;
  body: string;
}

export default function PartnerTab() {
  const { partnerSlug, tab } = useLocalSearchParams<{ partnerSlug: string; tab: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [page, setPage] = useState<PartnerPage | null>(null);

  useEffect(() => {
    if (!partnerSlug) return;
    supabase.from('partners').select('id, name, tabs').eq('slug', partnerSlug).single()
      .then(({ data }) => {
        if (data) {
          setPartner(data);
          supabase.from('partner_pages').select('title, body').eq('partner_id', data.id).eq('tab_slug', tab).single()
            .then(({ data: p }) => { if (p) setPage(p); });
        }
      });
  }, [partnerSlug, tab]);

  if (!partner) return <View style={styles.container}><AppHeader title="Partner" /><Text style={styles.loading}>Loading...</Text></View>;

  const tabs = routes.partners.tabItems(partnerSlug, partner.tabs || []);

  return (
    <View style={styles.container}>
      <AppHeader title={partner.name} />
      {tabs.length > 0 && <SubTabs tabs={tabs} />}
      <ScrollView contentContainerStyle={styles.content}>
        {page ? (
          <MarkdownRenderer content={page.body} />
        ) : (
          <Text style={styles.loading}>No content for this tab yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  content: { padding: 20, paddingBottom: 40 },
});
