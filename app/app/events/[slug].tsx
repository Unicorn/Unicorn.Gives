import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function EventDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    supabase.from('events').select('*').eq('slug', slug).single()
      .then(({ data }) => { if (data) setItem(data); });
  }, [slug]);

  if (!item) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Date</Text>
          <Text style={styles.metaValue}>{new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          {item.time && <><Text style={styles.metaLabel}>Time</Text><Text style={styles.metaValue}>{item.time}</Text></>}
          {item.location && <><Text style={styles.metaLabel}>Location</Text><Text style={styles.metaValue}>{item.location}</Text></>}
          {item.cost && <><Text style={styles.metaLabel}>Cost</Text><Text style={styles.metaValue}>{item.cost}</Text></>}
          {item.recurring && <><Text style={styles.metaLabel}>Recurrence</Text><Text style={styles.metaValue}>{item.recurrence_rule || 'Recurring'}</Text></>}
        </View>
        <MarkdownRenderer content={item.body} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 60 },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#2d4a4a', marginBottom: 16 },
  metaBox: { backgroundColor: '#f0ede8', borderRadius: 8, padding: 14, marginBottom: 20, gap: 4 },
  metaLabel: { fontSize: 11, fontWeight: '700', color: '#73796d', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 6 },
  metaValue: { fontSize: 15, color: '#2d4a4a', fontWeight: '500' },
});
