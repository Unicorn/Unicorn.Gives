import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import type { EventItem } from './eventTypes';
import { EventCardList } from './EventCardList';
import { eventDateBoxFromIso } from '@/lib/events/eventDateFormat';
import { useTheme, fonts } from '@/constants/theme';
import { COMMUNITY_SPIRIT_QUOTE } from '@/constants/hornContent';
import {
  CategoryChips,
  FeaturedEventCard,
  EditorialCard,
  QuoteCallout,
} from '@/components/widgets';
import { routes } from '@/lib/navigation';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';

const CATEGORY_LABELS: Record<string, string> = {
  government: 'Government',
  community: 'Community',
  conservation: 'Conservation',
  seniors: 'Seniors',
  horn: 'The Horn',
  'unicorn-gives': 'Unicorn Gives',
  'the-mane': 'The Mane',
};

// All category badges use neutral styling per design system rules

type EventWithDesc = EventItem & { description?: string | null };

interface Props {
  regionId?: string;
}

export function EventsList({ regionId }: Props) {
  const [events, setEvents] = useState<EventWithDesc[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    let query = supabase
      .from('events')
      .select('id, slug, title, description, date, time, location, category, recurring, tags')
      .eq('status', 'published');

    if (regionId) {
      query = query.eq('region_id', regionId);
    } else {
      query = query.in('visibility', ['global', 'both']);
    }

    query.order('date').limit(50).then(({ data }) => {
      if (data) setEvents(data);
    });
  }, [regionId]);

  const categories = [...new Set(events.map((e) => e.category))];
  const chipCategories = categories.map((key) => ({
    key,
    label: CATEGORY_LABELS[key] || key,
  }));

  const filtered = categoryFilter
    ? events.filter((e) => e.category === categoryFilter)
    : events;

  const [featured, ...rest] = filtered;

  const DEFAULT_BADGE = { bg: colors.surfaceContainer, text: colors.neutral };

  return (
    <Wrapper style={styles.container} contentContainerStyle={styles.content}>
      <Container>
      {/* Featured event hero */}
      {featured && !categoryFilter && (
        <FeaturedEventCard event={featured} />
      )}

      {/* Filters */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.neutral }]}>Community Calendar</Text>
        {chipCategories.length > 1 && (
          <CategoryChips
            categories={chipCategories}
            selected={categoryFilter}
            onSelect={setCategoryFilter}
            allLabel="All Events"
          />
        )}
        <Text style={[styles.count, { color: colors.neutralVariant }]}>
          {categoryFilter ? filtered.length : rest.length} events
        </Text>
      </View>

      {/* Event list — full-width rows */}
      <EventCardList>
        {(categoryFilter ? filtered : rest).map((e) => {
          const badge = DEFAULT_BADGE;
          return (
            <EditorialCard
              key={e.id}
              title={e.title}
              description={e.description || undefined}
              badge={{
                label: CATEGORY_LABELS[e.category] || e.category,
                bg: badge.bg,
                text: badge.text,
              }}
              href={routes.community.events.detail(e.slug)}
              meta={[e.time, e.location].filter(Boolean).join(' · ')}
              dateBox={eventDateBoxFromIso(e.date)}
            />
          );
        })}
      </EventCardList>

      {filtered.length === 0 && (
        <Text style={[styles.empty, { color: colors.neutralVariant }]}>No upcoming events.</Text>
      )}

      {/* Community quote */}
      {!categoryFilter && filtered.length > 0 && (
        <QuoteCallout
          quote={COMMUNITY_SPIRIT_QUOTE.quote}
          attribution={COMMUNITY_SPIRIT_QUOTE.attribution}
        />
      )}
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 20 },
  section: { gap: 8, zIndex: 1, position: 'relative' },
  sectionTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 26,
  },
  count: {
    fontFamily: fonts.sans,
    fontSize: 13,
  },
  empty: {
    fontFamily: fonts.sans,
    textAlign: 'center',
    marginTop: 40,
  },
});
