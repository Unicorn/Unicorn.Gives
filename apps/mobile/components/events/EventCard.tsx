import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  category: string;
  recurring: boolean;
  tags: string[] | null;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  festival: { bg: '#f5e6c8', text: '#8a6d3b' },
  meeting: { bg: '#d4e4c4', text: '#3b6b3b' },
  music: { bg: '#e5d8f0', text: '#6b4a8a' },
  food: { bg: '#f8d8c4', text: '#8a5a3b' },
  concert: { bg: '#e5d8f0', text: '#6b4a8a' },
  conservation: { bg: '#c8e6d8', text: '#2f6b4a' },
  outdoor: { bg: '#c8e6d8', text: '#2f6b4a' },
  government: { bg: '#d4dce8', text: '#3b5a8a' },
  market: { bg: '#f8d8c4', text: '#8a5a3b' },
  winter: { bg: '#d4e8f0', text: '#3b6b8a' },
  summer: { bg: '#f5ecc8', text: '#8a7d3b' },
  free: { bg: '#d4e4c4', text: '#3b6b3b' },
  'family-friendly': { bg: '#f0e0f0', text: '#7a4a7a' },
  history: { bg: '#e8dcd0', text: '#6b5a3b' },
  arts: { bg: '#e5d8f0', text: '#6b4a8a' },
  auction: { bg: '#f5e6c8', text: '#8a6d3b' },
  sports: { bg: '#d4dce8', text: '#3b5a8a' },
  spring: { bg: '#d4e4c4', text: '#3b6b3b' },
  fall: { bg: '#f5e6c8', text: '#8a6d3b' },
  seniors: { bg: '#e8dcd0', text: '#6b5a3b' },
};

const DEFAULT_TAG_COLOR = { bg: '#f0ede8', text: '#43493e' };

function tagLabel(tag: string): string {
  return tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function EventCard({ event }: { event: EventItem }) {
  const d = new Date(event.date + 'T00:00:00');
  const tags = event.tags?.length ? event.tags : [];

  return (
    <Link href={routes.community.events.detail(event.slug)} asChild>
      <TouchableOpacity style={styles.item}>
        <View style={styles.dateBox}>
          <Text style={styles.dateMonth}>
            {d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
          </Text>
          <Text style={styles.dateDay}>{d.getDate()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{event.title}</Text>
          {event.time && <Text style={styles.meta}>{event.time}</Text>}
          {event.location && <Text style={styles.meta}>{event.location}</Text>}
          {tags.length > 0 && (
            <View style={styles.tags}>
              {tags.map(tag => {
                const color = TAG_COLORS[tag] || DEFAULT_TAG_COLOR;
                return (
                  <View key={tag} style={[styles.tag, { backgroundColor: color.bg }]}>
                    <Text style={[styles.tagText, { color: color.text }]}>{tagLabel(tag)}</Text>
                  </View>
                );
              })}
            </View>
          )}
          {event.recurring && <Text style={styles.recurring}>Recurring</Text>}
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#c3c8bb',
    gap: 14,
    alignItems: 'flex-start',
  },
  dateBox: {
    width: 50,
    alignItems: 'center',
    backgroundColor: '#2d4a4a',
    borderRadius: 6,
    paddingVertical: 6,
  },
  dateMonth: { fontSize: 10, fontWeight: '700', color: '#d4b96e', letterSpacing: 1 },
  dateDay: { fontSize: 22, fontWeight: '800', color: '#fcf9f4' },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#2d4a4a', marginBottom: 2 },
  meta: { fontSize: 13, color: '#73796d' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  tagText: { fontSize: 11, fontWeight: '600' },
  recurring: { fontSize: 11, color: '#9b8ec4', fontWeight: '600', marginTop: 4 },
});
