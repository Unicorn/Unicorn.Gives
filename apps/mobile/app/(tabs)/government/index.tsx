import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, fontSize, letterSpacing, spacing, radii, shadows, type ThemeColors } from '@/constants/theme';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

const DEFAULT_COUNTY = 'clare-county';

interface Region {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string | null;
}

export default function GovernmentIndex() {
  const { colors } = useTheme();
  const [county, setCounty] = useState<Region | null>(null);
  const [municipalities, setMunicipalities] = useState<Region[]>([]);

  useEffect(() => {
    supabase
      .from('regions')
      .select('id, slug, name, type, description')
      .eq('slug', DEFAULT_COUNTY)
      .single()
      .then(({ data }) => {
        if (data) {
          setCounty(data);
          supabase
            .from('regions')
            .select('id, slug, name, type, description')
            .eq('parent_id', data.id)
            .eq('is_active', true)
            .order('display_order')
            .then(({ data: children }) => { if (children) setMunicipalities(children); });
        }
      });
  }, []);

  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!county) return <View style={styles.page}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <Wrapper style={styles.container} contentContainerStyle={styles.content}>
      <Container>
      <View style={styles.header}>
        <Text style={styles.type}>{county.type.toUpperCase()}</Text>
        <Text style={styles.name}>{county.name}</Text>
        {county.description && <Text style={styles.description}>{county.description}</Text>}
      </View>

      <Text style={styles.sectionTitle}>Municipalities</Text>
      {municipalities.map((m) => (
        <Link key={m.slug} href={routes.government.municipality(DEFAULT_COUNTY, m.slug)} asChild>
          <AnimatedPressable variant="card" style={styles.row}>
            <Text style={styles.rowTitle}>{m.name}</Text>
            <Text style={styles.rowMeta}>{m.type}</Text>
          </AnimatedPressable>
        </Link>
      ))}
      </Container>
    </Wrapper>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxxl + spacing.sm },
  loading: { fontFamily: fonts.sans, padding: spacing.xxl, color: colors.neutralVariant, textAlign: 'center' },
  header: { padding: spacing.xl },
  type: { fontFamily: fonts.sansBold, fontSize: fontSize.xs, color: colors.neutralVariant, letterSpacing: letterSpacing.wide, marginBottom: spacing.xs + 2, textTransform: 'uppercase' as const },
  name: { fontFamily: fonts.sansBold, fontSize: fontSize['3xl'], color: colors.neutral, marginBottom: spacing.xs + 2 },
  description: { fontFamily: fonts.sans, fontSize: fontSize.base, color: colors.neutralVariant, lineHeight: 22 },
  sectionTitle: { fontFamily: fonts.sansBold, fontSize: fontSize.sm + 1, color: colors.neutralVariant, letterSpacing: letterSpacing.wide, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.sm },
  row: { marginHorizontal: spacing.lg, marginBottom: spacing.sm, padding: spacing.lg, borderRadius: radii.md, backgroundColor: colors.surface, borderLeftWidth: 3, borderLeftColor: colors.primary, ...shadows.card },
  rowTitle: { fontFamily: fonts.sansBold, fontSize: fontSize.lg, color: colors.neutral },
  rowMeta: { fontFamily: fonts.sans, fontSize: fontSize.sm + 1, color: colors.neutralVariant, marginTop: spacing.xs, textTransform: 'capitalize' },
});
