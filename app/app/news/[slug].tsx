import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function NewsDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    supabase.from('news').select('*').eq('slug', slug).single()
      .then(({ data }) => { if (data) setItem(data); });
  }, [slug]);

  if (!item) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

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
