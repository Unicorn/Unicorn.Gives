import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { Link, useLocalSearchParams } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';

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
        <Text style={[styles.loading, { color: colors.neutralVariant }]}>Loading...</Text>
      </View>
    );
  }
  if (!region) {
    return (
      <View style={styles.page}>
        <Text style={[styles.loading, { color: colors.neutralVariant }]}>County not found</Text>
      </View>
    );
  }

  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={styles.content}>
      <Container>
        <View style={styles.header}>
          <Text style={[styles.type, { color: colors.neutralVariant }]}>{region.type.toUpperCase()}</Text>
          {region.description && <Text style={[styles.description, { color: colors.neutralVariant }]}>{region.description}</Text>}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.neutralVariant }]}>Municipalities</Text>
        {children.map((c) => (
          <Link key={c.slug} href={routes.government.municipality(countySlug, c.slug)} asChild>
            <TouchableOpacity style={StyleSheet.flatten([styles.row, { backgroundColor: colors.surface, borderColor: colors.outline }])}>
              <Text style={[styles.rowTitle, { color: colors.neutral }]}>{c.name}</Text>
              <Text style={[styles.rowMeta, { color: colors.neutralVariant }]}>{c.type}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { paddingBottom: 40, flexGrow: 1 },
  loading: { padding: spacing.xxl, textAlign: 'center' },
  header: { padding: spacing.xl },
  type: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  description: { fontSize: 15, lineHeight: 22 },
  sectionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.sm },
  row: { marginHorizontal: spacing.lg, marginBottom: spacing.sm, padding: spacing.lg, borderRadius: radii.sm, borderWidth: 1 },
  rowTitle: { fontSize: 16, fontWeight: '700' },
  rowMeta: { fontSize: 13, marginTop: spacing.xs, textTransform: 'capitalize' },
});
