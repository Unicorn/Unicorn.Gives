import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import type { MunicipalSegment } from '@/lib/navigation';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';

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

export function MunicipalMinutesDetail({ segment }: { segment: MunicipalSegment }) {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { municipalSlug } = useMunicipalRoute(segment);
  const { region } = useRegion(municipalSlug);
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

  if (!item) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.meta}>
        <Text style={styles.date}>
          {new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>
        <View style={[styles.badge, item.status === 'approved' ? styles.badgeApproved : styles.badgePending]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>
      {(item.attendees_present?.length > 0 || item.attendees_absent?.length > 0) && (
        <View style={styles.attendees}>
          {item.attendees_present?.length > 0 && (
            <View style={styles.attendeeRow}>
              <Text style={styles.attendeeLabel}>Present:</Text>
              <Text style={styles.attendeeNames}>{item.attendees_present.join(', ')}</Text>
            </View>
          )}
          {item.attendees_absent?.length > 0 && (
            <View style={styles.attendeeRow}>
              <Text style={styles.attendeeLabel}>Absent:</Text>
              <Text style={styles.attendeeNames}>{item.attendees_absent.join(', ')}</Text>
            </View>
          )}
          {item.attendees_also_present?.length > 0 && (
            <View style={styles.attendeeRow}>
              <Text style={styles.attendeeLabel}>Also present:</Text>
              <Text style={styles.attendeeNames}>{item.attendees_also_present.join(', ')}</Text>
            </View>
          )}
        </View>
      )}
      <MarkdownRenderer content={item.body} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 60 },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#2d4a4a', marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  date: { fontSize: 14, color: '#73796d' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeApproved: { backgroundColor: '#d4e4c4' },
  badgePending: { backgroundColor: '#f5e6c8' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#43493e', textTransform: 'capitalize' },
  attendees: { backgroundColor: '#f0ede8', borderRadius: 8, padding: 14, marginBottom: 20, gap: 6 },
  attendeeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  attendeeLabel: { fontSize: 13, fontWeight: '700', color: '#2d4a4a' },
  attendeeNames: { fontSize: 13, color: '#43493e', flex: 1 },
});
