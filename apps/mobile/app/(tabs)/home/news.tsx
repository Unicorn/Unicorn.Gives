import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string | null;
}

export default function NewsTab() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    supabase
      .from('news')
      .select('id, slug, title, date, category, description')
      .eq('status', 'published')
      .in('visibility', ['global', 'both'])
      .order('date', { ascending: false })
      .limit(50)
      .then(({ data }) => { if (data) setItems(data); });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Latest News</Text>
      {items.map(n => (
        <TouchableOpacity key={n.id} style={styles.card}>
          <Text style={styles.category}>{n.category.replace(/-/g, ' ').toUpperCase()}</Text>
          <Text style={styles.title}>{n.title}</Text>
          {n.description && <Text style={styles.desc} numberOfLines={2}>{n.description}</Text>}
          <Text style={styles.date}>
            {new Date(n.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </TouchableOpacity>
      ))}
      {items.length === 0 && (
        <Text style={styles.empty}>No published news items yet. Check back soon for civic updates.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', color: '#2d4a4a', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#c3c8bb' },
  category: { fontSize: 11, fontWeight: '700', color: '#8a9a7c', letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '700', color: '#2d4a4a', marginBottom: 4 },
  desc: { fontSize: 14, color: '#43493e', lineHeight: 20, marginBottom: 4 },
  date: { fontSize: 12, color: '#73796d' },
  empty: { textAlign: 'center', color: '#73796d', marginTop: 40 },
});
