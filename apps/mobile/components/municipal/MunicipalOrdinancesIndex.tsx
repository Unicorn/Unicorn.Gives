import { useEffect, useState } from 'react';
import { Text, ScrollView, TouchableOpacity, TextInput, View } from 'react-native';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { RegionHeroSection } from '@/components/municipal/sections/RegionHeroSection';
import { Link } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { matchesSearchQuery } from '@/lib/search';
import { supabase } from '@/lib/supabase';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { useTheme, fonts, fontSize, spacing, letterSpacing, radii } from '@/constants/theme';

interface Ordinance {
  id: string;
  slug: string;
  title: string;
  number: number | null;
  description: string | null;
  category: string;
  body: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  zoning: 'Zoning', 'public-safety': 'Public Safety', environment: 'Environment',
  property: 'Property', infrastructure: 'Infrastructure', general: 'General',
};

export function MunicipalOrdinancesIndex() {
  const { colors } = useTheme();
  const { municipalitySlug, basePath } = useMunicipalRoute();
  const { region } = useRegion(municipalitySlug);
  const [items, setItems] = useState<Ordinance[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!region) return;
    supabase
      .from('ordinances')
      .select('id, slug, title, number, description, category, body')
      .eq('region_id', region.id)
      .eq('status', 'published')
      .order('number')
      .then(({ data }) => { if (data) setItems(data); });
  }, [region]);

  const categories = [...new Set(items.map(o => o.category))];
  const filtered = items.filter(o => {
    if (filter && o.category !== filter) return false;
    const catLabel = CATEGORY_LABELS[o.category] || o.category;
    const numStr = o.number != null ? String(o.number) : '';
    return matchesSearchQuery(search, [o.title, o.description, o.body, catLabel, numStr]);
  });

  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <RegionHeroSection
        eyebrow="Ordinances"
        headline={region?.name}
        subheadline="Local laws and regulations governing the municipality."
      />
      <Container style={{ paddingTop: spacing.xxl }}>
      <View style={{ paddingHorizontal: spacing.lg }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, padding: spacing.md, fontSize: fontSize.base, fontFamily: fonts.sans, backgroundColor: colors.surface, marginBottom: spacing.md, color: colors.neutral }}
        placeholder="Search ordinances..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={colors.neutralVariant}
      />
      {categories.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          <TouchableOpacity style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1, borderColor: !filter ? colors.heroBar : colors.outline, marginRight: spacing.sm, backgroundColor: !filter ? colors.heroBar : colors.surface }} onPress={() => setFilter(null)}>
            <Text style={{ fontSize: 13, fontFamily: fonts.sansMedium, color: !filter ? colors.onHeroBar : colors.neutral }}>{`All`}</Text>
          </TouchableOpacity>
          {categories.map(c => (
            <TouchableOpacity key={c} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1, borderColor: filter === c ? colors.heroBar : colors.outline, marginRight: spacing.sm, backgroundColor: filter === c ? colors.heroBar : colors.surface }} onPress={() => setFilter(filter === c ? null : c)}>
              <Text style={{ fontSize: 13, fontFamily: fonts.sansMedium, color: filter === c ? colors.onHeroBar : colors.neutral }}>{CATEGORY_LABELS[c] || c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {filtered.map(o => (
        <Link key={o.id} href={`${basePath}/ordinances/${o.slug}` as any} asChild>
          <TouchableOpacity style={{ backgroundColor: colors.surface, borderRadius: radii.sm, padding: 14, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.outline }}>
            {o.number && <Text style={{ fontSize: fontSize.sm, fontFamily: fonts.sansBold, color: colors.neutralVariant, marginBottom: 2 }}>Ord. {o.number}</Text>}
            <Text style={{ fontSize: fontSize.lg, fontFamily: fonts.sansMedium, color: colors.neutral, marginBottom: spacing.xs }}>{o.title}</Text>
            {o.description && <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, lineHeight: 20, marginBottom: spacing.xs }}>{o.description}</Text>}
            <Text style={{ fontSize: fontSize.xs, fontFamily: fonts.sans, color: colors.neutralVariant, textTransform: 'uppercase', letterSpacing: letterSpacing.normal }}>{CATEGORY_LABELS[o.category] || o.category}</Text>
          </TouchableOpacity>
        </Link>
      ))}
      </View>
      </Container>
    </Wrapper>
  );
}
