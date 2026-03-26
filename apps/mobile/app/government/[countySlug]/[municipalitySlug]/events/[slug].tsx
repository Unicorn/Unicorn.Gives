import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

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
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);

  useEffect(() => {
    if (!slug) return;
    supabase.from('events').select('*').eq('slug', slug).single()
      .then(({ data }) => { if (data) setEvent(data); });
  }, [slug]);

  if (!event) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  const d = new Date(event.date + 'T00:00:00');
  const tags = event.tags?.length ? event.tags : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>
        {d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </Text>
      {event.time && <Text style={styles.meta}>{event.time}</Text>}
      {event.location && <Text style={styles.meta}>{event.location}</Text>}
      {event.cost && <Text style={styles.meta}>Cost: {event.cost}</Text>}
      {event.recurring && event.recurrence_rule && (
        <Text style={styles.meta}>Schedule: {event.recurrence_rule}</Text>
      )}
      {tags.length > 0 && (
        <View style={styles.tags}>
          {tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Text>
            </View>
          ))}
        </View>
      )}
      {event.body && <Text style={styles.body}>{event.body}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#2d4a4a', marginBottom: 12 },
  date: { fontSize: 15, fontWeight: '600', color: '#43493e', marginBottom: 4 },
  meta: { fontSize: 14, color: '#73796d', marginBottom: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12, marginBottom: 12 },
  tag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, backgroundColor: '#f0ede8' },
  tagText: { fontSize: 12, fontWeight: '600', color: '#43493e' },
  body: { fontSize: 15, color: '#43493e', lineHeight: 24, marginTop: 16 },
});
