import { View, Text, StyleSheet } from 'react-native';
import { routes } from '@/lib/navigation';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';
import { eventDateBoxFromIso } from '@/lib/events/eventDateFormat';
import { EditorialCard } from '@/components/widgets/EditorialCard';
import type { EventItem } from './eventTypes';

export type { EventItem } from './eventTypes';

function tagLabel(tag: string): string {
  return tag.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function EventCard({ event }: { event: EventItem }) {
  const { colors } = useTheme();
  const tags = event.tags?.length ? event.tags : [];
  const dateBox = eventDateBoxFromIso(event.date);

  const footer =
    tags.length > 0 || event.recurring ? (
      <>
        {tags.length > 0 && (
          <View style={styles.tags}>
            {tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.surfaceContainer }]}>
                <Text style={[styles.tagText, { color: colors.neutral }]}>{tagLabel(tag)}</Text>
              </View>
            ))}
          </View>
        )}
        {event.recurring && (
          <Text style={[styles.recurring, { color: colors.purple }]}>Recurring</Text>
        )}
      </>
    ) : undefined;

  return (
    <EditorialCard
      href={routes.community.events.detail(event.slug)}
      title={event.title}
      meta={[event.time, event.location].filter(Boolean).join(' · ') || undefined}
      dateBox={dateBox}
      footer={footer}
    />
  );
}

const styles = StyleSheet.create({
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: 4 },
  tag: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.pill },
  tagText: { fontFamily: fonts.sansMedium, fontSize: 11 },
  recurring: { fontFamily: fonts.sansMedium, fontSize: 11, marginTop: spacing.xs },
});
