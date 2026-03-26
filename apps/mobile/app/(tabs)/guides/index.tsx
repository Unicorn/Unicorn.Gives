import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { toHref } from '@/lib/navigation';

interface Guide {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: string | null;
  jurisdiction: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  property: 'Property & Building',
  taxes: 'Taxes & Assessment',
  safety: 'Safety & Emergency',
  nature: 'Nature & Conservation',
  government: 'Government & Records',
  services: 'Community Services',
  records: 'Records',
};

export default function GuidesIndex() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('guides')
      .select('id, slug, title, description, category, icon, jurisdiction')
      .eq('status', 'published')
      .order('title')
      .then(({ data }) => { if (data) setGuides(data); });
  }, []);

  const categories = [...new Set(guides.map(g => g.category))];
  const filtered = filter ? guides.filter(g => g.category === filter) : guides;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>What do you need help with?</Text>
      <Text style={styles.subheading}>
        Step-by-step guides for common civic tasks in Clare County.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <TouchableOpacity
          style={[styles.chip, !filter && styles.chipActive]}
          onPress={() => setFilter(null)}
        >
          <Text style={[styles.chipText, !filter && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {categories.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, filter === c && styles.chipActive]}
            onPress={() => setFilter(filter === c ? null : c)}
          >
            <Text style={[styles.chipText, filter === c && styles.chipTextActive]}>
              {CATEGORY_LABELS[c] || c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.count}>{filtered.length} guides</Text>

      {filtered.map(g => (
        <Link key={g.id} href={toHref(`/guides/${g.slug}`)} asChild>
          <TouchableOpacity style={styles.card}>
            {g.icon && <Text style={styles.icon}>{g.icon}</Text>}
            <View style={styles.cardBody}>
              <Text style={styles.title}>{g.title}</Text>
              <Text style={styles.desc} numberOfLines={2}>{g.description}</Text>
              <Text style={styles.meta}>
                {CATEGORY_LABELS[g.category] || g.category} · {g.jurisdiction}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      ))}

      {guides.length === 0 && (
        <Text style={styles.empty}>Loading guides...</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', color: '#2d4a4a', marginBottom: 4 },
  subheading: { fontSize: 15, color: '#73796d', lineHeight: 22, marginBottom: 16 },
  chips: { marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#c3c8bb', marginRight: 8, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#2d4a4a', borderColor: '#2d4a4a' },
  chipText: { fontSize: 13, color: '#43493e', fontWeight: '500' },
  chipTextActive: { color: '#fcf9f4' },
  count: { fontSize: 13, color: '#73796d', marginBottom: 12 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#c3c8bb', gap: 12, alignItems: 'flex-start' },
  icon: { fontSize: 28 },
  cardBody: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#2d4a4a', marginBottom: 4 },
  desc: { fontSize: 14, color: '#43493e', lineHeight: 20, marginBottom: 6 },
  meta: { fontSize: 12, color: '#8a9a7c' },
  empty: { textAlign: 'center', color: '#73796d', marginTop: 40 },
});
