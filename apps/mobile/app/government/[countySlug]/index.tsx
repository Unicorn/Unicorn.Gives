import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { Link, useLocalSearchParams } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, fontSize, letterSpacing, spacing, radii } from '@/constants/theme';
import { SeoHead } from '@/components/SeoHead';
import { getDefaultDescription } from '@/lib/seo';
import { fetchCountySlugParams } from '@/lib/static-build-queries';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

export async function generateStaticParams() {
  return fetchCountySlugParams();
}

interface ChildRegion {
  id: string;
  slug: string;
  name: string;
  type: string;
}

export default function CountyOverview() {
  const { colors } = useTheme();
  const { countySlug } = useLocalSearchParams<{ countySlug: string }>();
  const { region, isLoading } = useRegion(countySlug);
  const [children, setChildren] = useState<ChildRegion[]>([]);

  useEffect(() => {
    if (!region) return;
    supabase
      .from('regions')
      .select('id, slug, name, type')
      .eq('parent_id', region.id)
      .eq('is_active', true)
      .order('display_order')
      .then(({ data }) => { if (data) setChildren(data); });
  }, [region]);

  if (isLoading) {
    return (
      <View style={styles.page}>
        <SeoHead
          title={countySlug ? `County · ${String(countySlug)}` : 'County'}
          description={getDefaultDescription()}
        />
        <Text style={[styles.loading, { color: colors.neutralVariant }]}>Loading...</Text>
      </View>
    );
  }
  if (!region) {
    return (
      <View style={styles.page}>
        <SeoHead title="County not found" description={getDefaultDescription()} noIndex />
        <Text style={[styles.loading, { color: colors.neutralVariant }]}>County not found</Text>
      </View>
    );
  }

  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={styles.content}>
      <SeoHead
        title={region.name}
        description={region.description ?? `${region.name} municipalities and local government on UNI Gives.`}
      />
      <Container>
        <View style={styles.header}>
          <Text style={[styles.type, { color: colors.neutralVariant }]}>{region.type.toUpperCase()}</Text>
          {region.description && <Text style={[styles.description, { color: colors.neutralVariant }]}>{region.description}</Text>}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.neutralVariant }]}>Municipalities</Text>
        {children.map((c) => (
          <Link key={c.slug} href={routes.government.municipality(countySlug, c.slug)} asChild>
            <AnimatedPressable variant="card" style={StyleSheet.flatten([styles.row, { backgroundColor: colors.surface, borderColor: colors.outline }])}>
              <Text style={[styles.rowTitle, { color: colors.neutral }]}>{c.name}</Text>
              <Text style={[styles.rowMeta, { color: colors.neutralVariant }]}>{c.type}</Text>
            </AnimatedPressable>
          </Link>
        ))}
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { paddingBottom: spacing.xxxl + spacing.sm, flexGrow: 1 },
  loading: { fontFamily: fonts.sans, padding: spacing.xxl, textAlign: 'center' },
  header: { padding: spacing.xl },
  type: { fontFamily: fonts.sansBold, fontSize: fontSize.xs, letterSpacing: letterSpacing.wide, marginBottom: spacing.xs + 2 },
  description: { fontFamily: fonts.sans, fontSize: fontSize.base, lineHeight: 22 },
  sectionTitle: { fontFamily: fonts.sansBold, fontSize: fontSize.sm + 1, letterSpacing: letterSpacing.wide, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.sm },
  row: { marginHorizontal: spacing.lg, marginBottom: spacing.sm, padding: spacing.lg, borderRadius: radii.sm, borderWidth: 1 },
  rowTitle: { fontFamily: fonts.sansBold, fontSize: fontSize.lg },
  rowMeta: { fontFamily: fonts.sans, fontSize: fontSize.sm + 1, marginTop: spacing.xs, textTransform: 'capitalize' },
});
