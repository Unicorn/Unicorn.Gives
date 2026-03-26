import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { homeColors, homeFonts, homeRadii } from '@/constants/homeTheme';
import type { EventItem } from '@/components/events/EventCard';

interface FeaturedEventCardProps {
  event: EventItem & { description?: string | null; location?: string | null };
}

export function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const d = new Date(event.date + 'T00:00:00');
  const monthDay = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const year = d.getFullYear();

  return (
    <Link href={routes.community.events.detail(event.slug)} asChild>
      <TouchableOpacity
        style={[styles.card, isTablet && styles.cardTablet]}
        activeOpacity={0.85}
      >
        {/* Color accent side / top */}
        <View style={[styles.accentBlock, isTablet && styles.accentBlockTablet]}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>Featured</Text>
          </View>
          <View style={styles.dateDisplay}>
            <Text style={styles.dateDisplayMonth}>{monthDay}</Text>
            <Text style={styles.dateDisplayYear}>{year}</Text>
          </View>
          {event.location && (
            <Text style={styles.locationText} numberOfLines={1}>
              {event.location}
            </Text>
          )}
        </View>

        {/* Content side */}
        <View style={[styles.content, isTablet && styles.contentTablet]}>
          <Text style={[styles.title, isTablet && styles.titleTablet]}>
            {event.title}
          </Text>
          {event.description && (
            <Text style={styles.description} numberOfLines={3}>
              {event.description}
            </Text>
          )}
          {event.time && <Text style={styles.time}>{event.time}</Text>}
          <View style={styles.ctaRow}>
            <View style={styles.ctaButton}>
              <Text style={styles.ctaText}>View Details</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: homeColors.surface,
    borderRadius: homeRadii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: homeColors.outline,
  },
  cardTablet: {
    flexDirection: 'row',
  },
  accentBlock: {
    backgroundColor: homeColors.primaryContainer,
    padding: 24,
    gap: 8,
  },
  accentBlockTablet: {
    width: '40%',
    justifyContent: 'center',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: homeColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: homeRadii.pill,
  },
  featuredBadgeText: {
    fontFamily: homeFonts.sansBold,
    fontSize: 10,
    color: '#211b00',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  dateDisplay: {
    marginTop: 8,
  },
  dateDisplayMonth: {
    fontFamily: homeFonts.serifBold,
    fontSize: 22,
    color: homeColors.onPrimary,
  },
  dateDisplayYear: {
    fontFamily: homeFonts.sans,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  locationText: {
    fontFamily: homeFonts.sans,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    padding: 24,
    gap: 10,
    flex: 1,
  },
  contentTablet: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: homeFonts.serifItalic,
    fontSize: 26,
    color: homeColors.onSurface,
    lineHeight: 32,
  },
  titleTablet: {
    fontSize: 30,
    lineHeight: 36,
  },
  description: {
    fontFamily: homeFonts.sans,
    fontSize: 14,
    color: homeColors.onSurfaceVariant,
    lineHeight: 21,
  },
  time: {
    fontFamily: homeFonts.sansMedium,
    fontSize: 13,
    color: homeColors.muted,
  },
  ctaRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: homeColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: homeRadii.pill,
  },
  ctaText: {
    fontFamily: homeFonts.sansBold,
    fontSize: 13,
    color: homeColors.onPrimary,
  },
});
