import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { ContentContainer } from '@/components/layout/ContentContainer';

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ContentContainer>
      <View style={styles.header}>
        <Text style={styles.type}>{county.type.toUpperCase()}</Text>
        <Text style={styles.name}>{county.name}</Text>
        {county.description && <Text style={styles.description}>{county.description}</Text>}
      </View>

      <Text style={styles.sectionTitle}>Municipalities</Text>
      {municipalities.map((m) => (
        <Link key={m.slug} href={routes.government.municipality(DEFAULT_COUNTY, m.slug)} asChild>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>{m.name}</Text>
            <Text style={styles.rowMeta}>{m.type}</Text>
          </TouchableOpacity>
        </Link>
      ))}
      </ContentContainer>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  loading: { padding: 24, color: colors.neutralVariant, textAlign: 'center' },
  header: { padding: 20 },
  type: { fontSize: 11, fontWeight: '700', color: colors.neutralVariant, letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' as const },
  name: { fontSize: 24, fontWeight: '800', color: colors.neutral, marginBottom: 6 },
  description: { fontSize: 15, color: colors.neutralVariant, lineHeight: 22 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: colors.neutralVariant, letterSpacing: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  row: { marginHorizontal: 16, marginBottom: 8, padding: 16, borderRadius: radii.md, backgroundColor: colors.surface, ...shadows.card },
  rowTitle: { fontSize: 16, fontWeight: '700', color: colors.neutral },
  rowMeta: { fontSize: 13, color: colors.neutralVariant, marginTop: 4, textTransform: 'capitalize' },
});
