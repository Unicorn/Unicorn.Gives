import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface Ordinance {
  title: string;
  number: number | null;
  description: string | null;
  body: string;
  category: string;
  adopted_date: string | null;
  amended_date: string | null;
  pdf_url: string | null;
}

export default function OrdinanceDetail() {
  const { regionSlug, slug } = useLocalSearchParams<{ regionSlug: string; slug: string }>();
  const { region } = useRegion(regionSlug);
  const [item, setItem] = useState<Ordinance | null>(null);

  useEffect(() => {
    if (!region || !slug) return;
    supabase.from('ordinances').select('*').eq('region_id', region.id).eq('slug', slug).single()
      .then(({ data }) => { if (data) setItem(data); });
  }, [region, slug]);

  if (!item) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {item.number && <Text style={styles.number}>Ordinance {item.number}</Text>}
        <Text style={styles.title}>{item.title}</Text>
        {item.description && <Text style={styles.desc}>{item.description}</Text>}

        <View style={styles.metaRow}>
          {item.adopted_date && <Text style={styles.meta}>Adopted: {item.adopted_date}</Text>}
          {item.amended_date && <Text style={styles.meta}>Amended: {item.amended_date}</Text>}
        </View>

        {item.pdf_url && (
          <TouchableOpacity style={styles.pdfButton} onPress={() => Linking.openURL(item.pdf_url!)}>
            <Text style={styles.pdfText}>View Full PDF</Text>
          </TouchableOpacity>
        )}

        <MarkdownRenderer content={item.body} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 60 },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  number: { fontSize: 13, fontWeight: '700', color: '#8a9a7c', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', color: '#2d4a4a', marginBottom: 8 },
  desc: { fontSize: 15, color: '#43493e', lineHeight: 22, marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  meta: { fontSize: 13, color: '#73796d' },
  pdfButton: { backgroundColor: '#2d4a4a', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  pdfText: { color: '#fcf9f4', fontWeight: '600', fontSize: 14 },
});
