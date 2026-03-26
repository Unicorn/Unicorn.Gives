import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';

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

function tagLabel(tag: string): string {
  return tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function EventCard({ event }: { event: EventItem }) {
  const { colors } = useTheme();
  const d = new Date(event.date + 'T00:00:00');
  const tags = event.tags?.length ? event.tags : [];

  return (
    <Link href={routes.community.events.detail(event.slug)} asChild>
      <Pressable style={StyleSheet.flatten([styles.item, { backgroundColor: colors.surface, borderColor: colors.outline }])}>
        <View style={[styles.dateBox, { borderColor: colors.neutral }]}>
          <Text style={[styles.dateMonth, { color: colors.neutralVariant }]}>
            {d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
          </Text>
          <Text style={[styles.dateDay, { color: colors.neutral }]}>{d.getDate()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.neutral }]}>{event.title}</Text>
          {event.time && <Text style={[styles.meta, { color: colors.neutralVariant }]}>{event.time}</Text>}
          {event.location && <Text style={[styles.meta, { color: colors.neutralVariant }]}>{event.location}</Text>}
          {tags.length > 0 && (
            <View style={styles.tags}>
              {tags.map(tag => (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.surfaceContainer }]}>
                  <Text style={[styles.tagText, { color: colors.neutral }]}>{tagLabel(tag)}</Text>
                </View>
              ))}
            </View>
          )}
          {event.recurring && <Text style={[styles.recurring, { color: colors.purple }]}>Recurring</Text>}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    gap: 14,
    alignItems: 'flex-start',
    shadowColor: '#1a1b25',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  dateBox: {
    width: 50,
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 6,
    borderWidth: 1.5,
  },
  dateMonth: { fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1 },
  dateDay: { fontFamily: fonts.sansBold, fontSize: 22, fontWeight: '800' },
  info: { flex: 1 },
  title: { fontFamily: fonts.sansBold, fontSize: 15, marginBottom: 2 },
  meta: { fontFamily: fonts.sans, fontSize: 13 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: 6 },
  tag: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.pill },
  tagText: { fontFamily: fonts.sansMedium, fontSize: 11 },
  recurring: { fontFamily: fonts.sansMedium, fontSize: 11, marginTop: spacing.xs },
});
