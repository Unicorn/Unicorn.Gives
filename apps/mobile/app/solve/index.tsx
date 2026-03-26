import { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { routes } from '@/lib/navigation';
import { matchesSearchQuery } from '@/lib/search';
import { supabase } from '@/lib/supabase';

interface Guide {
  id: string;
  slug: string;
  title: string;
  scenario: string;
  category: string;
  icon: string | null;
  description: string | null;
  body: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  property: 'Property & Building', taxes: 'Taxes & Assessment', safety: 'Safety & Emergency',
  nature: 'Nature & Conservation', government: 'Government', services: 'Services', records: 'Records',
};

export default function HelpIndex() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(params.category || null);

  useEffect(() => {
    supabase.from('guides').select('id, slug, title, scenario, category, icon, description, body')
      .eq('status', 'published').order('category').order('title')
      .then(({ data }) => { if (data) setGuides(data); });
  }, []);

  const categories = [...new Set(guides.map(g => g.category))];
  const filtered = guides.filter(g => {
    if (filter && g.category !== filter) return false;
    return matchesSearchQuery(search, [g.title, g.scenario, g.description, g.body]);
  });

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TextInput
          style={styles.search}
          placeholder="What do you need help with?"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#73796d"
        />

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

        {filtered.map(g => (
          <Link key={g.id} href={routes.solve.flow(g.slug)} asChild>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.scenario}>{g.scenario}</Text>
              <Text style={styles.guideTitle}>{g.title}</Text>
              <Text style={styles.cat}>{CATEGORY_LABELS[g.category] || g.category}</Text>
            </TouchableOpacity>
          </Link>
        ))}
        {filtered.length === 0 && <Text style={styles.empty}>No guides found.</Text>}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },
  search: { borderWidth: 1, borderColor: '#c3c8bb', borderRadius: 8, padding: 14, fontSize: 15, backgroundColor: '#fff', marginBottom: 12, color: '#43493e' },
  filters: { marginBottom: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#c3c8bb', marginRight: 8, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#2d4a4a', borderColor: '#2d4a4a' },
  chipText: { fontSize: 13, color: '#43493e', fontWeight: '500' },
  chipTextActive: { color: '#fcf9f4' },
  item: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#c3c8bb' },
  scenario: { fontSize: 15, fontWeight: '600', color: '#2d4a4a', marginBottom: 4 },
  guideTitle: { fontSize: 13, color: '#43493e', marginBottom: 6 },
  cat: { fontSize: 11, color: '#8a9a7c', textTransform: 'uppercase', letterSpacing: 0.5 },
  empty: { textAlign: 'center', color: '#73796d', marginTop: 40 },
});
