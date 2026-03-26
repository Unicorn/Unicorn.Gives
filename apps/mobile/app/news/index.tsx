import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  date: string;
  category: string;
  featured: boolean;
}

export default function NewsIndex() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    supabase.from('news').select('id, slug, title, description, date, category, featured')
      .eq('status', 'published').in('visibility', ['global', 'both'])
      .order('date', { ascending: false }).limit(50)
      .then(({ data }) => { if (data) setItems(data); });
  }, []);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {items.map(item => (
          <Link key={item.id} href={routes.news.detail(item.slug)} asChild>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.category}>{item.category.replace(/-/g, ' ').toUpperCase()}</Text>
              <Text style={styles.title}>{item.title}</Text>
              {item.description && <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>}
              <Text style={styles.date}>{new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
            </TouchableOpacity>
          </Link>
        ))}
        {items.length === 0 && <Text style={styles.empty}>No news articles yet.</Text>}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },
  item: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#c3c8bb' },
  category: { fontSize: 10, fontWeight: '700', color: '#8a9a7c', letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 17, fontWeight: '700', color: '#2d4a4a', marginBottom: 4 },
  desc: { fontSize: 14, color: '#43493e', lineHeight: 20, marginBottom: 6 },
  date: { fontSize: 12, color: '#73796d' },
  empty: { textAlign: 'center', color: '#73796d', marginTop: 40 },
});
