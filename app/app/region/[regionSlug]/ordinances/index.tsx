import { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { routes } from '@/lib/navigation';
import { matchesSearchQuery } from '@/lib/search';
import { supabase } from '@/lib/supabase';

interface Ordinance {
  id: string;
  slug: string;
  title: string;
  number: number | null;
  description: string | null;
  category: string;
  body: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  zoning: 'Zoning', 'public-safety': 'Public Safety', environment: 'Environment',
  property: 'Property', infrastructure: 'Infrastructure', general: 'General',
};

export default function OrdinancesIndex() {
  const { regionSlug } = useLocalSearchParams<{ regionSlug: string }>();
  const { region } = useRegion(regionSlug);
  const [items, setItems] = useState<Ordinance[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!region) return;
    supabase
      .from('ordinances')
      .select('id, slug, title, number, description, category, body')
      .eq('region_id', region.id)
      .eq('status', 'published')
      .order('number')
      .then(({ data }) => { if (data) setItems(data); });
  }, [region]);

  const categories = [...new Set(items.map(o => o.category))];
  const filtered = items.filter(o => {
    if (filter && o.category !== filter) return false;
    const catLabel = CATEGORY_LABELS[o.category] || o.category;
    const numStr = o.number != null ? String(o.number) : '';
    return matchesSearchQuery(search, [o.title, o.description, o.body, catLabel, numStr]);
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        style={styles.search}
        placeholder="Search ordinances..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#73796d"
      />

      {categories.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          <TouchableOpacity style={[styles.chip, !filter && styles.chipActive]} onPress={() => setFilter(null)}>
            <Text style={[styles.chipText, !filter && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          {categories.map(c => (
            <TouchableOpacity key={c} style={[styles.chip, filter === c && styles.chipActive]} onPress={() => setFilter(filter === c ? null : c)}>
              <Text style={[styles.chipText, filter === c && styles.chipTextActive]}>{CATEGORY_LABELS[c] || c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {filtered.map(o => (
        <Link
          key={o.id}
          href={routes.region.ordinances.detail(regionSlug, o.slug)}
          asChild
        >
          <TouchableOpacity style={styles.item}>
            {o.number && <Text style={styles.number}>Ord. {o.number}</Text>}
            <Text style={styles.title}>{o.title}</Text>
            {o.description && <Text style={styles.desc}>{o.description}</Text>}
            <Text style={styles.category}>{CATEGORY_LABELS[o.category] || o.category}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },
  search: { borderWidth: 1, borderColor: '#c3c8bb', borderRadius: 8, padding: 12, fontSize: 15, backgroundColor: '#fff', marginBottom: 12, color: '#43493e' },
  filters: { marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#c3c8bb', marginRight: 8, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#2d4a4a', borderColor: '#2d4a4a' },
  chipText: { fontSize: 13, color: '#43493e', fontWeight: '500' },
  chipTextActive: { color: '#fcf9f4' },
  item: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#c3c8bb' },
  number: { fontSize: 12, fontWeight: '700', color: '#8a9a7c', marginBottom: 2 },
  title: { fontSize: 16, fontWeight: '600', color: '#2d4a4a', marginBottom: 4 },
  desc: { fontSize: 13, color: '#43493e', lineHeight: 20, marginBottom: 4 },
  category: { fontSize: 11, color: '#73796d', textTransform: 'uppercase', letterSpacing: 0.5 },
});
