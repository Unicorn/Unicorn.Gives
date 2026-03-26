import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';

interface CountyRow {
  id: string;
  slug: string;
  name: string;
}

export default function ExploreScreen() {
  const [counties, setCounties] = useState<CountyRow[]>([]);

  useEffect(() => {
    supabase
      .from('regions')
      .select('id, slug, name')
      .eq('type', 'county')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data }) => {
        if (data) setCounties(data);
      });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.sub}>Choose a county to browse townships, cities, and villages.</Text>
      {counties.map((c) => (
        <Link key={c.id} href={routes.county.root(c.slug)} asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>{c.name}</Text>
            <Text style={styles.cardMeta}>County hub</Text>
          </TouchableOpacity>
        </Link>
      ))}
      {counties.length === 0 && (
        <Text style={styles.empty}>No counties available yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: '#2d4a4a', marginBottom: 8 },
  sub: { fontSize: 15, color: '#73796d', marginBottom: 20, lineHeight: 22 },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c3c8bb',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#2d4a4a' },
  cardMeta: { fontSize: 13, color: '#73796d', marginTop: 4 },
  empty: { color: '#73796d', fontSize: 15 },
});
