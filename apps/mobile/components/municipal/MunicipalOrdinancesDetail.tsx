import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { useLocalSearchParams } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { useTheme, fonts, fontSize, spacing, radii } from '@/constants/theme';

interface Ordinance {
  title: string;
  number: number | null;
  description: string | null;
  body: string;
  category: string;
  adopted_date: string | null;
  amended_date: string | null;
  pdf_url: string | null;
}

export function MunicipalOrdinancesDetail() {
  const { colors } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { municipalitySlug } = useMunicipalRoute();
  const { region } = useRegion(municipalitySlug);
  const [item, setItem] = useState<Ordinance | null>(null);

  useEffect(() => {
    if (!region || !slug) return;
    supabase.from('ordinances').select('*').eq('region_id', region.id).eq('slug', slug).single()
      .then(({ data }) => { if (data) setItem(data); });
  }, [region, slug]);

  if (!item) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ padding: spacing.xxl, color: colors.neutralVariant, textAlign: 'center' }}>Loading...</Text></View>;

  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }}>
      <Container>
      <View style={{ padding: spacing.xl }}>
      {item.number && <Text style={{ fontSize: 13, fontFamily: fonts.sansBold, color: colors.neutralVariant, marginBottom: spacing.xs }}>Ordinance {item.number}</Text>}
      <Text style={{ fontSize: fontSize['3xl'], fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: spacing.sm }}>{item.title}</Text>
      {item.description && <Text style={{ fontSize: fontSize.base, fontFamily: fonts.sans, color: colors.neutral, lineHeight: 22, marginBottom: spacing.md }}>{item.description}</Text>}
      <View style={{ flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.lg }}>
        {item.adopted_date && <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutralVariant }}>Adopted: {item.adopted_date}</Text>}
        {item.amended_date && <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutralVariant }}>Amended: {item.amended_date}</Text>}
      </View>
      {item.pdf_url && (
        <TouchableOpacity style={{ backgroundColor: colors.heroBar, padding: spacing.md, borderRadius: radii.sm, alignItems: 'center', marginBottom: spacing.xl }} onPress={() => Linking.openURL(item.pdf_url!)}>
          <Text style={{ color: colors.onHeroBar, fontFamily: fonts.sansMedium, fontSize: fontSize.md }}>View Full PDF</Text>
        </TouchableOpacity>
      )}
      <MarkdownRenderer content={item.body} />
      </View>
      </Container>
    </Wrapper>
  );
}
