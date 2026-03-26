import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { supabase } from '@/lib/supabase';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';

export function MunicipalHub() {
  const { colors } = useTheme();
  const { municipalitySlug, basePath } = useMunicipalRoute();
  const { region, isLoading } = useRegion(municipalitySlug);
  const [stats, setStats] = useState({ minutes: 0, ordinances: 0, contacts: 0, events: 0 });

  useEffect(() => {
    if (!region) return;
    Promise.all([
      supabase.from('minutes').select('*', { count: 'exact', head: true }).eq('region_id', region.id),
      supabase.from('ordinances').select('*', { count: 'exact', head: true }).eq('region_id', region.id),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('region_id', region.id),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('region_id', region.id).eq('status', 'published'),
    ]).then(([m, o, c, e]) => {
      setStats({ minutes: m.count || 0, ordinances: o.count || 0, contacts: c.count || 0, events: e.count || 0 });
    });
  }, [region]);

  if (isLoading) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ padding: spacing.xxl, color: colors.neutralVariant, textAlign: 'center' }}>Loading...</Text></View>;
  if (!region) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ padding: spacing.xxl, color: colors.neutralVariant, textAlign: 'center' }}>Municipality not found</Text></View>;

  const sections = [
    { label: 'Meeting Minutes', count: stats.minutes, href: `${basePath}/minutes`, icon: '📋' },
    { label: 'Ordinances', count: stats.ordinances, href: `${basePath}/ordinances`, icon: '📜' },
    { label: 'Contact Directory', count: stats.contacts, href: `${basePath}/contacts`, icon: '📞' },
    { label: 'Events', count: stats.events, href: `${basePath}/events`, icon: '📅' },
    { label: 'Elections', count: 0, href: `${basePath}/elections`, icon: '🗳️' },
    { label: 'Zoning', count: 0, href: `${basePath}/zoning`, icon: '🗺️' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ backgroundColor: colors.heroBar, padding: spacing.xxl, paddingTop: spacing.lg }}>
        <Text style={{ fontSize: 11, fontFamily: fonts.sansBold, color: colors.gold, letterSpacing: 1, marginBottom: spacing.xs }}>{region.type.toUpperCase()}</Text>
        <Text style={{ fontSize: 28, fontFamily: fonts.sansBold, color: colors.background, marginBottom: spacing.sm }}>{region.name}</Text>
        {region.description && <Text style={{ fontSize: 15, fontFamily: fonts.sans, color: colors.outline, lineHeight: 22 }}>{region.description}</Text>}
      </View>
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        {sections.map((s) => (
          <Link key={s.label} href={s.href as any} asChild>
            <TouchableOpacity style={{ backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.xl, borderWidth: 1, borderColor: colors.outline }}>
              <Text style={{ fontSize: 28, marginBottom: spacing.sm }}>{s.icon}</Text>
              <Text style={{ fontSize: 16, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: spacing.xs }}>{s.label}</Text>
              {s.count > 0 && <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutralVariant }}>{s.count} records</Text>}
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
