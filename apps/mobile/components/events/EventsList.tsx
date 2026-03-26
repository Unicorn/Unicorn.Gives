import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { EventCard, type EventItem } from './EventCard';
import { homeColors, homeFonts } from '@/constants/homeTheme';
import { COMMUNITY_SPIRIT_QUOTE } from '@/constants/hornContent';
import {
  CategoryChips,
  FeaturedEventCard,
  EditorialCard,
  QuoteCallout,
} from '@/components/widgets';
import { routes } from '@/lib/navigation';

const CATEGORY_LABELS: Record<string, string> = {
  government: 'Government',
  community: 'Community',
  conservation: 'Conservation',
  seniors: 'Seniors',
  horn: 'The Horn',
  'unicorn-gives': 'Unicorn Gives',
  'the-mane': 'The Mane',
};

const CATEGORY_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  government: { bg: '#d4dce8', text: '#3b5a8a' },
  community: { bg: '#d4e4c4', text: '#3b6b3b' },
  conservation: { bg: '#c8e6d8', text: '#2f6b4a' },
  seniors: { bg: '#e8dcd0', text: '#6b5a3b' },
  horn: { bg: '#f5e6c8', text: '#8a6d3b' },
  'unicorn-gives': { bg: '#e5d8f0', text: '#6b4a8a' },
  'the-mane': { bg: '#f0e0f0', text: '#7a4a7a' },
};

const DEFAULT_BADGE = { bg: '#f0ede8', text: '#43493e' };

type EventWithDesc = EventItem & { description?: string | null };

interface Props {
  regionId?: string;
}

export function EventsList({ regionId }: Props) {
  const [events, setEvents] = useState<EventWithDesc[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Featured event hero */}
      {featured && !categoryFilter && (
        <FeaturedEventCard event={featured} />
      )}

      {/* Filters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Calendar</Text>
        {chipCategories.length > 1 && (
          <CategoryChips
            categories={chipCategories}
            selected={categoryFilter}
            onSelect={setCategoryFilter}
            allLabel="All Events"
          />
        )}
        <Text style={styles.count}>
          {categoryFilter ? filtered.length : rest.length} events
        </Text>
      </View>

      {/* Event grid */}
      <View style={[styles.grid, isTablet && styles.gridTablet]}>
        {(categoryFilter ? filtered : rest).map((e) => {
          const d = new Date(e.date + 'T00:00:00');
          const badge = CATEGORY_BADGE_COLORS[e.category] || DEFAULT_BADGE;
          return (
            <View
              key={e.id}
              style={[styles.gridItem, isTablet && styles.gridItemTablet]}
            >
              <EditorialCard
                title={e.title}
                description={e.description || undefined}
                badge={{
                  label: CATEGORY_LABELS[e.category] || e.category,
                  bg: badge.bg,
                  text: badge.text,
                }}
                href={routes.community.events.detail(e.slug)}
                meta={[e.time, e.location].filter(Boolean).join(' · ')}
                dateBox={{
                  month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
                  day: d.getDate(),
                }}
              />
            </View>
          );
        })}
      </View>

      {filtered.length === 0 && (
        <Text style={styles.empty}>No upcoming events.</Text>
      )}

      {/* Community quote */}
      {!categoryFilter && filtered.length > 0 && (
        <QuoteCallout
          quote={COMMUNITY_SPIRIT_QUOTE.quote}
          attribution={COMMUNITY_SPIRIT_QUOTE.attribution}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: homeColors.background },
  content: { padding: 16, paddingBottom: 40, gap: 20 },
  section: { gap: 8, zIndex: 1, position: 'relative' },
  sectionTitle: {
    fontFamily: homeFonts.serifItalic,
    fontSize: 26,
    color: homeColors.onSurface,
  },
  count: {
    fontFamily: homeFonts.sans,
    fontSize: 13,
    color: homeColors.muted,
  },
  grid: {
    gap: 12,
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {},
  gridItemTablet: {
    width: '48.5%',
  },
  empty: {
    fontFamily: homeFonts.sans,
    textAlign: 'center',
    color: homeColors.muted,
    marginTop: 40,
  },
});
