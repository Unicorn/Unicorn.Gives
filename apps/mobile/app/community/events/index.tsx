import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';

interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  category: string;
  recurring: boolean;
}

export default function EventsIndex() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    supabase.from('events').select('id, slug, title, date, time, location, category, recurring')
      .eq('status', 'published').in('visibility', ['global', 'both'])
      .order('date').limit(50)
      .then(({ data }) => { if (data) setEvents(data); });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {events.map(e => (
        <Link key={e.id} href={routes.community.events.detail(e.slug)} asChild>
          <TouchableOpacity style={styles.item}>
            <View style={styles.dateBox}>
              <Text style={styles.dateMonth}>{new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</Text>
              <Text style={styles.dateDay}>{new Date(e.date + 'T00:00:00').getDate()}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{e.title}</Text>
              {e.time && <Text style={styles.meta}>{e.time}</Text>}
              {e.location && <Text style={styles.meta}>{e.location}</Text>}
              {e.recurring && <Text style={styles.recurring}>Recurring</Text>}
            </View>
          </TouchableOpacity>
        </Link>
      ))}
      {events.length === 0 && <Text style={styles.empty}>No upcoming events.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },
  item: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#c3c8bb', gap: 14, alignItems: 'center' },
  dateBox: { width: 50, alignItems: 'center', backgroundColor: '#2d4a4a', borderRadius: 6, paddingVertical: 6 },
  dateMonth: { fontSize: 10, fontWeight: '700', color: '#d4b96e', letterSpacing: 1 },
  dateDay: { fontSize: 22, fontWeight: '800', color: '#fcf9f4' },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#2d4a4a', marginBottom: 2 },
  meta: { fontSize: 13, color: '#73796d' },
  recurring: { fontSize: 11, color: '#9b8ec4', fontWeight: '600', marginTop: 2 },
  empty: { textAlign: 'center', color: '#73796d', marginTop: 40 },
});
