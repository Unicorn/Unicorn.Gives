import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme, spacing, radii } from '@/constants/theme';

interface EventDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  body: string | null;
  date: string;
  end_date: string | null;
  time: string | null;
  location: string | null;
  category: string;
  recurring: boolean;
  recurrence_rule: string | null;
  cost: string | null;
  tags: string[] | null;
}

export default function MunicipalEventDetail() {
  const { colors } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);

  useEffect(() => {
    if (!slug) return;
    supabase.from('events').select('*').eq('slug', slug).single()
      .then(({ data }) => { if (data) setEvent(data); });
  }, [slug]);

  if (!event) return <View style={[styles.container, { backgroundColor: colors.background }]}><Text style={[styles.loading, { color: colors.neutralVariant }]}>Loading...</Text></View>;

  const d = new Date(event.date + 'T00:00:00');
  const tags = event.tags?.length ? event.tags : [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.neutral }]}>{event.title}</Text>
      <Text style={[styles.date, { color: colors.neutral }]}>
        {d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </Text>
      {event.time && <Text style={[styles.meta, { color: colors.neutralVariant }]}>{event.time}</Text>}
      {event.location && <Text style={[styles.meta, { color: colors.neutralVariant }]}>{event.location}</Text>}
      {event.cost && <Text style={[styles.meta, { color: colors.neutralVariant }]}>Cost: {event.cost}</Text>}
      {event.recurring && event.recurrence_rule && (
        <Text style={[styles.meta, { color: colors.neutralVariant }]}>Schedule: {event.recurrence_rule}</Text>
      )}
      {tags.length > 0 && (
        <View style={styles.tags}>
          {tags.map(tag => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.surfaceContainer }]}>
              <Text style={[styles.tagText, { color: colors.neutral }]}>{tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Text>
            </View>
          ))}
        </View>
      )}
      {event.body && <Text style={[styles.body, { color: colors.neutral }]}>{event.body}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 40 },
  loading: { padding: spacing.xxl, textAlign: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: spacing.md },
  date: { fontSize: 15, fontWeight: '600', marginBottom: spacing.xs },
  meta: { fontSize: 14, marginBottom: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.md, marginBottom: spacing.md },
  tag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radii.md },
  tagText: { fontSize: 12, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 24, marginTop: spacing.lg },
});
