import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string | null;
}

export default function NewsTab() {
  const { colors } = useTheme();
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

  const styles = useMemo(() => createStyles(colors), [colors]);

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

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', color: colors.neutral, marginBottom: 16 },
  card: { borderRadius: radii.sm, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.outline },
  category: { fontSize: 11, fontWeight: '700', color: colors.neutralVariant, letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '700', color: colors.neutral, marginBottom: 4 },
  desc: { fontSize: 14, color: colors.neutral, lineHeight: 20, marginBottom: 4 },
  date: { fontSize: 12, color: colors.neutralVariant },
  empty: { textAlign: 'center', color: colors.neutralVariant, marginTop: 40 },
});
