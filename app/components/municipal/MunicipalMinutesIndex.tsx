import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { matchesSearchQuery } from '@/lib/search';
import { supabase } from '@/lib/supabase';
import type { MunicipalSegment } from '@/lib/municipalPaths';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';

interface MinutesSummary {
  id: string;
  slug: string;
  title: string;
  date: string;
  meeting_type: string;
  status: string;
  body: string;
}

export function MunicipalMinutesIndex({ segment }: { segment: MunicipalSegment }) {
  const { municipalSlug, basePath } = useMunicipalRoute(segment);
  const { region } = useRegion(municipalSlug);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        style={styles.search}
        placeholder="Search minutes..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#73796d"
      />
      {types.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          <TouchableOpacity style={[styles.chip, !typeFilter && styles.chipActive]} onPress={() => setTypeFilter(null)}>
            <Text style={[styles.chipText, !typeFilter && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          {types.map(t => (
            <TouchableOpacity key={t} style={[styles.chip, typeFilter === t && styles.chipActive]} onPress={() => setTypeFilter(typeFilter === t ? null : t)}>
              <Text style={[styles.chipText, typeFilter === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <Text style={styles.count}>{filtered.length} minutes</Text>
      {filtered.map(m => (
        <Link key={m.id} href={`${basePath}/minutes/${m.slug}` as any} asChild>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Text style={styles.itemDate}>
                {new Date(m.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
              <Text style={styles.itemTitle}>{m.title}</Text>
              <Text style={styles.itemType}>{m.meeting_type}</Text>
            </View>
            <View style={[styles.badge, m.status === 'approved' ? styles.badgeApproved : styles.badgePending]}>
              <Text style={styles.badgeText}>{m.status}</Text>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },
  search: { borderWidth: 1, borderColor: '#c3c8bb', borderRadius: 8, padding: 12, fontSize: 15, backgroundColor: '#fff', marginBottom: 12, color: '#43493e' },
  filters: { marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#c3c8bb', marginRight: 8, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#2d4a4a', borderColor: '#2d4a4a' },
  chipText: { fontSize: 13, color: '#43493e', fontWeight: '500' },
  chipTextActive: { color: '#fcf9f4' },
  count: { fontSize: 13, color: '#73796d', marginBottom: 12 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#c3c8bb' },
  itemLeft: { flex: 1 },
  itemDate: { fontSize: 12, color: '#73796d', marginBottom: 2 },
  itemTitle: { fontSize: 15, fontWeight: '600', color: '#2d4a4a', marginBottom: 2 },
  itemType: { fontSize: 12, color: '#8a9a7c' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeApproved: { backgroundColor: '#d4e4c4' },
  badgePending: { backgroundColor: '#f5e6c8' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#43493e', textTransform: 'capitalize' },
});
