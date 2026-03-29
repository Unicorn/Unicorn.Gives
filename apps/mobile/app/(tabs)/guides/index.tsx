import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { toHref } from '@/lib/navigation';
import { useTheme, fonts, fontSize, spacing, radii, shadows, type ThemeColors } from '@/constants/theme';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

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
    <Wrapper style={styles.container} contentContainerStyle={styles.content}>
      <Container>
      <Text style={styles.heading}>What do you need help with?</Text>
      <Text style={styles.subheading}>
        Step-by-step guides for common civic tasks in Clare County.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <AnimatedPressable
          variant="subtle"
          style={[styles.chip, !filter && styles.chipActive]}
          onPress={() => setFilter(null)}
        >
          <Text style={[styles.chipText, !filter && styles.chipTextActive]}>All</Text>
        </AnimatedPressable>
        {categories.map(c => (
          <AnimatedPressable
            key={c}
            variant="subtle"
            style={[styles.chip, filter === c && styles.chipActive]}
            onPress={() => setFilter(filter === c ? null : c)}
          >
            <Text style={[styles.chipText, filter === c && styles.chipTextActive]}>
              {CATEGORY_LABELS[c] || c}
            </Text>
          </AnimatedPressable>
        ))}
      </ScrollView>

      <Text style={styles.count}>{filtered.length} guides</Text>

      {filtered.map(g => (
        <Link key={g.id} href={toHref(`/guides/${g.slug}`)} asChild>
          <AnimatedPressable variant="card" style={styles.card}>
            {g.icon && <Text style={styles.icon}>{g.icon}</Text>}
            <View style={styles.cardBody}>
              <Text style={styles.title}>{g.title}</Text>
              <Text style={styles.desc} numberOfLines={2}>{g.description}</Text>
              <Text style={styles.meta}>
                {CATEGORY_LABELS[g.category] || g.category} · {g.jurisdiction}
              </Text>
            </View>
          </AnimatedPressable>
        </Link>
      ))}

      {guides.length === 0 && (
        <Text style={styles.empty}>Loading guides...</Text>
      )}
      </Container>
    </Wrapper>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl + spacing.sm },
  heading: { fontFamily: fonts.sansBold, fontSize: fontSize['2xl'], color: colors.neutral, marginBottom: spacing.xs },
  subheading: { fontFamily: fonts.sans, fontSize: fontSize.base, color: colors.neutralVariant, lineHeight: 22, marginBottom: spacing.lg },
  chips: { marginBottom: spacing.md },
  chip: { paddingHorizontal: spacing.lg - 2, paddingVertical: spacing.xs + 2, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.outline, marginRight: spacing.sm },
  chipActive: { backgroundColor: colors.neutral, borderColor: colors.neutral },
  chipText: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm + 1, color: colors.neutral },
  chipTextActive: { color: colors.background },
  count: { fontFamily: fonts.sans, fontSize: fontSize.sm + 1, color: colors.neutralVariant, marginBottom: spacing.md },
  card: { flexDirection: 'row', borderRadius: radii.md, padding: spacing.lg, marginBottom: spacing.sm + 2, backgroundColor: colors.surface, ...shadows.card, gap: spacing.md, alignItems: 'flex-start' },
  icon: { fontSize: fontSize['4xl'] },
  cardBody: { flex: 1 },
  title: { fontFamily: fonts.sansBold, fontSize: fontSize.lg, color: colors.neutral, marginBottom: spacing.xs },
  desc: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutral, lineHeight: 20, marginBottom: spacing.xs + 2 },
  meta: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },
  empty: { fontFamily: fonts.sans, textAlign: 'center', color: colors.neutralVariant, marginTop: spacing.xxxl + spacing.sm },
});
