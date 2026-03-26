import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { toHref } from '@/lib/navigation';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';

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
  const { colors } = useTheme();
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

  const styles = useMemo(() => createStyles(colors), [colors]);

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

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', color: colors.neutral, marginBottom: 4 },
  subheading: { fontSize: 15, color: colors.neutralVariant, lineHeight: 22, marginBottom: 16 },
  chips: { marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.outline, marginRight: 8 },
  chipActive: { backgroundColor: colors.neutral, borderColor: colors.neutral },
  chipText: { fontSize: 13, color: colors.neutral, fontWeight: '500' },
  chipTextActive: { color: colors.background },
  count: { fontSize: 13, color: colors.neutralVariant, marginBottom: 12 },
  card: { flexDirection: 'row', borderRadius: radii.md, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.outline, gap: 12, alignItems: 'flex-start' },
  icon: { fontSize: 28 },
  cardBody: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: colors.neutral, marginBottom: 4 },
  desc: { fontSize: 14, color: colors.neutral, lineHeight: 20, marginBottom: 6 },
  meta: { fontSize: 12, color: colors.neutralVariant },
  empty: { textAlign: 'center', color: colors.neutralVariant, marginTop: 40 },
});
