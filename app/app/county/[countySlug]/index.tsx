import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { AppHeader } from '@/components/layout/AppHeader';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';

interface ChildRegion {
  id: string;
  slug: string;
  name: string;
  type: string;
}

export default function CountyOverview() {
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
        <AppHeader title="County" />
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }
  if (!region) {
    return (
      <View style={styles.page}>
        <AppHeader title="County" />
        <Text style={styles.loading}>County not found</Text>
      </View>
    );
  }

  const townships = children.filter((c) => c.type === 'township');
  const cities = children.filter((c) => c.type === 'city');
  const villages = children.filter((c) => c.type === 'village');

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title={region.name} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.type}>{region.type.toUpperCase()}</Text>
          {region.description && <Text style={styles.description}>{region.description}</Text>}
        </View>

        <Text style={styles.sectionTitle}>Browse</Text>
        <Link href={routes.county.townships.index(countySlug)} asChild>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>Townships</Text>
            <Text style={styles.rowMeta}>{townships.length} listed</Text>
          </TouchableOpacity>
        </Link>
        <Link href={routes.county.cities.index(countySlug)} asChild>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>Cities</Text>
            <Text style={styles.rowMeta}>{cities.length} listed</Text>
          </TouchableOpacity>
        </Link>
        <Link href={routes.county.villages.index(countySlug)} asChild>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>Villages</Text>
            <Text style={styles.rowMeta}>{villages.length} listed</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.sectionTitle}>County</Text>
        <Link href={routes.county.news(countySlug)} asChild>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>News</Text>
          </TouchableOpacity>
        </Link>
        <Link href={routes.county.events(countySlug)} asChild>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>Events</Text>
          </TouchableOpacity>
        </Link>
        <Link href={routes.county.department(countySlug, 'administration')} asChild>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>Departments</Text>
            <Text style={styles.rowMeta}>e.g. Administration</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4' },
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { paddingBottom: 40 },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  header: { padding: 20, backgroundColor: '#2d4a4a' },
  type: { fontSize: 11, fontWeight: '700', color: '#d4b96e', letterSpacing: 1, marginBottom: 6 },
  description: { fontSize: 15, color: '#c3c8bb', lineHeight: 22 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#8a9a7c', letterSpacing: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  row: { marginHorizontal: 16, marginBottom: 8, padding: 16, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#c3c8bb' },
  rowTitle: { fontSize: 16, fontWeight: '700', color: '#2d4a4a' },
  rowMeta: { fontSize: 13, color: '#73796d', marginTop: 4 },
});
