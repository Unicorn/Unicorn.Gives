import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { supabase } from '@/lib/supabase';
import type { MunicipalSegment } from '@/lib/municipalPaths';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';

export function MunicipalHub({ segment }: { segment: MunicipalSegment }) {
  const { municipalSlug, basePath } = useMunicipalRoute(segment);
  const { region, isLoading } = useRegion(municipalSlug);
  const [stats, setStats] = useState({ minutes: 0, ordinances: 0, contacts: 0 });

  useEffect(() => {
    if (!region) return;
    Promise.all([
      supabase.from('minutes').select('*', { count: 'exact', head: true }).eq('region_id', region.id),
      supabase.from('ordinances').select('*', { count: 'exact', head: true }).eq('region_id', region.id),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('region_id', region.id),
    ]).then(([m, o, c]) => {
      setStats({ minutes: m.count || 0, ordinances: o.count || 0, contacts: c.count || 0 });
    });
  }, [region]);

  if (isLoading) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;
  if (!region) return <View style={styles.container}><Text style={styles.loading}>Municipality not found</Text></View>;

  const sections = [
    { label: 'Meeting Minutes', count: stats.minutes, href: `${basePath}/minutes`, icon: '📋' },
    { label: 'Ordinances', count: stats.ordinances, href: `${basePath}/ordinances`, icon: '📜' },
    { label: 'Contact Directory', count: stats.contacts, href: `${basePath}/contacts`, icon: '📞' },
    { label: 'Elections', count: 0, href: `${basePath}/elections`, icon: '🗳️' },
    { label: 'Permits', count: 0, href: `${basePath}/permits`, icon: '📋' },
    { label: 'Zoning', count: 0, href: `${basePath}/zoning`, icon: '🗺️' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.type}>{region.type.toUpperCase()}</Text>
        <Text style={styles.name}>{region.name}</Text>
        {region.description && <Text style={styles.description}>{region.description}</Text>}
      </View>
      <View style={styles.grid}>
        {sections.map((s) => (
          <Link key={s.label} href={s.href as any} asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardIcon}>{s.icon}</Text>
              <Text style={styles.cardLabel}>{s.label}</Text>
              {s.count > 0 && <Text style={styles.cardCount}>{s.count} records</Text>}
            </TouchableOpacity>
          </Link>
        ))}
      </View>
      <Link href={`${basePath}/communities/lake-george` as any} asChild>
        <TouchableOpacity style={styles.pilot}>
          <Text style={styles.pilotText}>Pilot community page (Lake George) — stub</Text>
        </TouchableOpacity>
      </Link>
      <Link href={`${basePath}/sad` as any} asChild>
        <TouchableOpacity style={styles.pilot}>
          <Text style={styles.pilotText}>Special assessment districts — stub</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { paddingBottom: 40 },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  header: { backgroundColor: '#2d4a4a', padding: 24, paddingTop: 16 },
  type: { fontSize: 11, fontWeight: '700', color: '#d4b96e', letterSpacing: 1, marginBottom: 4 },
  name: { fontSize: 28, fontWeight: '800', color: '#fcf9f4', marginBottom: 8 },
  description: { fontSize: 15, color: '#c3c8bb', lineHeight: 22 },
  grid: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#c3c8bb' },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardLabel: { fontSize: 16, fontWeight: '700', color: '#2d4a4a', marginBottom: 4 },
  cardCount: { fontSize: 13, color: '#73796d' },
  pilot: { marginHorizontal: 16, marginTop: 8, padding: 14, backgroundColor: '#e8f0e0', borderRadius: 8 },
  pilotText: { fontSize: 14, color: '#2d4a4a', fontWeight: '600' },
});
