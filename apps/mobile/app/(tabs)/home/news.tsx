import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { routes } from '@/lib/navigation';

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
      <ContentContainer>
      <Text style={styles.heading}>Latest News</Text>
      {items.map(n => (
        <Link key={n.id} href={routes.community.news.detail(n.slug)} asChild>
          <AnimatedPressable variant="card" style={styles.card}>
            <Text style={styles.category}>{n.category.replace(/-/g, ' ').toUpperCase()}</Text>
            <Text style={styles.title}>{n.title}</Text>
            {n.description && <Text style={styles.desc} numberOfLines={2}>{n.description}</Text>}
            <Text style={styles.date}>
              {new Date(n.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </AnimatedPressable>
        </Link>
      ))}
      {items.length === 0 && (
        <Text style={styles.empty}>No published news items yet. Check back soon for civic updates.</Text>
      )}
      </ContentContainer>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', color: colors.neutral, marginBottom: 16 },
  card: { borderRadius: radii.sm, padding: 14, marginBottom: 8, backgroundColor: colors.surface, ...shadows.card },
  category: { fontSize: 11, fontWeight: '700', color: colors.neutralVariant, letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '700', color: colors.neutral, marginBottom: 4 },
  desc: { fontSize: 14, color: colors.neutral, lineHeight: 20, marginBottom: 4 },
  date: { fontSize: 12, color: colors.neutralVariant },
  empty: { textAlign: 'center', color: colors.neutralVariant, marginTop: 40 },
});
