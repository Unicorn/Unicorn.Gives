import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { Link } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { matchesSearchQuery } from '@/lib/search';
import { supabase } from '@/lib/supabase';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';

interface MinutesSummary {
  id: string;
  slug: string;
  title: string;
  date: string;
  meeting_type: string;
  status: string;
  body: string;
}

export function MunicipalMinutesIndex() {
  const { colors } = useTheme();
  const { municipalitySlug, basePath } = useMunicipalRoute();
  const { region } = useRegion(municipalitySlug);
  const [minutes, setMinutes] = useState<MinutesSummary[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!region) return;
    supabase
      .from('minutes')
      .select('id, slug, title, date, meeting_type, status, body')
      .eq('region_id', region.id)
      .order('date', { ascending: false })
      .then(({ data }) => { if (data) setMinutes(data); });
  }, [region]);

  const types = [...new Set(minutes.map(m => m.meeting_type))];
  const filtered = minutes.filter(m => {
    if (typeFilter && m.meeting_type !== typeFilter) return false;
    if (!matchesSearchQuery(search, [m.title, m.meeting_type, m.date, m.body])) return false;
    return true;
  });

  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <Container>
      <View style={{ padding: spacing.lg }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, padding: spacing.md, fontSize: 15, fontFamily: fonts.sans, backgroundColor: colors.surface, marginBottom: spacing.md, color: colors.neutral }}
        placeholder="Search minutes..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={colors.neutralVariant}
      />
      {types.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          <TouchableOpacity style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1, borderColor: !typeFilter ? colors.heroBar : colors.outline, marginRight: spacing.sm, backgroundColor: !typeFilter ? colors.heroBar : colors.surface }} onPress={() => setTypeFilter(null)}>
            <Text style={{ fontSize: 13, fontFamily: fonts.sansMedium, color: !typeFilter ? colors.onHeroBar : colors.neutral }}>{`All`}</Text>
          </TouchableOpacity>
          {types.map(t => (
            <TouchableOpacity key={t} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1, borderColor: typeFilter === t ? colors.heroBar : colors.outline, marginRight: spacing.sm, backgroundColor: typeFilter === t ? colors.heroBar : colors.surface }} onPress={() => setTypeFilter(typeFilter === t ? null : t)}>
              <Text style={{ fontSize: 13, fontFamily: fonts.sansMedium, color: typeFilter === t ? colors.onHeroBar : colors.neutral }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutralVariant, marginBottom: spacing.md }}>{filtered.length} minutes</Text>
      {filtered.map(m => (
        <Link key={m.id} href={`${basePath}/minutes/${m.slug}` as any} asChild>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radii.sm, padding: 14, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.outline }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontFamily: fonts.sans, color: colors.neutralVariant, marginBottom: 2 }}>
                {new Date(m.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
              <Text style={{ fontSize: 15, fontFamily: fonts.sansMedium, color: colors.neutral, marginBottom: 2 }}>{m.title}</Text>
              <Text style={{ fontSize: 12, fontFamily: fonts.sans, color: colors.neutralVariant }}>{m.meeting_type}</Text>
            </View>
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, backgroundColor: m.status === 'approved' ? colors.surfaceContainer : colors.goldContainer }}>
              <Text style={{ fontSize: 11, fontFamily: fonts.sansMedium, color: colors.neutral, textTransform: 'capitalize' }}>{m.status}</Text>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
      </View>
      </Container>
    </Wrapper>
  );
}
