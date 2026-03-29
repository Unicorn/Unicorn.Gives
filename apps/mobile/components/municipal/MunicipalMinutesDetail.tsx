import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { useLocalSearchParams } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';

interface Minutes {
  id: string;
  title: string;
  date: string;
  meeting_type: string;
  status: string;
  source: string;
  body: string;
  attendees_present: string[];
  attendees_absent: string[];
  attendees_also_present: string[];
}

export function MunicipalMinutesDetail() {
  const { colors } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { municipalitySlug } = useMunicipalRoute();
  const { region } = useRegion(municipalitySlug);
  const [item, setItem] = useState<Minutes | null>(null);

  useEffect(() => {
    if (!region || !slug) return;
    supabase
      .from('minutes')
      .select('*')
      .eq('region_id', region.id)
      .eq('slug', slug)
      .single()
      .then(({ data }) => { if (data) setItem(data); });
  }, [region, slug]);

  if (!item) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ padding: spacing.xxl, color: colors.neutralVariant, textAlign: 'center' }}>Loading...</Text></View>;

  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }}>
      <Container>
      <View style={{ padding: spacing.xl }}>
      <Text style={{ fontSize: 24, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: spacing.sm }}>{item.title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
        <Text style={{ fontSize: 14, fontFamily: fonts.sans, color: colors.neutralVariant }}>
          {new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>
        <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, backgroundColor: item.status === 'approved' ? colors.surfaceContainer : colors.goldContainer }}>
          <Text style={{ fontSize: 11, fontFamily: fonts.sansMedium, color: colors.neutral, textTransform: 'capitalize' }}>{item.status}</Text>
        </View>
      </View>
      {(item.attendees_present?.length > 0 || item.attendees_absent?.length > 0) && (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radii.md,
            padding: 14,
            marginBottom: spacing.xl,
            gap: 6,
            ...shadows.cardElevated,
          }}
        >
          {item.attendees_present?.length > 0 && (
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 13, fontFamily: fonts.sansBold, color: colors.neutral }}>Present:</Text>
              <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, flex: 1 }}>{item.attendees_present.join(', ')}</Text>
            </View>
          )}
          {item.attendees_absent?.length > 0 && (
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 13, fontFamily: fonts.sansBold, color: colors.neutral }}>Absent:</Text>
              <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, flex: 1 }}>{item.attendees_absent.join(', ')}</Text>
            </View>
          )}
          {item.attendees_also_present?.length > 0 && (
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 13, fontFamily: fonts.sansBold, color: colors.neutral }}>Also present:</Text>
              <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, flex: 1 }}>{item.attendees_also_present.join(', ')}</Text>
            </View>
          )}
        </View>
      )}
      <MarkdownRenderer content={item.body} />
      </View>
      </Container>
    </Wrapper>
  );
}
