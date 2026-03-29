import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import type { EventItem } from '@/components/events/eventTypes';

interface FeaturedEventCardProps {
  event: EventItem & { description?: string | null; location?: string | null };
}

export function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  const { width } = useWindowDimensions();
  const { colors, chips } = useTheme();
  const isTablet = width >= 768;

  const d = new Date(event.date + 'T00:00:00');
  const monthDay = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const year = d.getFullYear();

  const cardStyle = StyleSheet.flatten([
    styles.card,
    { backgroundColor: colors.surface },
    isTablet ? styles.cardTablet : undefined,
  ]) as ViewStyle;

  return (
    <Link href={routes.community.events.detail(event.slug)} style={cardStyle as any}>
        {/* Color accent side / top */}
        <View style={StyleSheet.flatten([styles.accentBlock, isTablet ? styles.accentBlockTablet : undefined])}>
          <View style={[styles.featuredBadge, { backgroundColor: chips.gold.backgroundColor, borderColor: chips.gold.borderColor }]}>
            <Text style={[styles.featuredBadgeText, { color: chips.gold.color }]}>Featured</Text>
          </View>
          <View style={styles.dateDisplay}>
            <Text style={[styles.dateDisplayMonth, { color: colors.neutral }]}>{monthDay}</Text>
            <Text style={[styles.dateDisplayYear, { color: colors.neutralVariant }]}>{year}</Text>
          </View>
          {event.location && (
            <Text style={[styles.locationText, { color: colors.neutralVariant }]} numberOfLines={1}>
              {event.location}
            </Text>
          )}
        </View>

        {/* Content side */}
        <View style={StyleSheet.flatten([styles.content, isTablet ? styles.contentTablet : undefined])}>
          <Text style={StyleSheet.flatten([styles.title, { color: colors.neutral }, isTablet ? styles.titleTablet : undefined])}>
            {event.title}
          </Text>
          {event.description && (
            <Text style={[styles.description, { color: colors.neutralVariant }]} numberOfLines={3}>
              {event.description}
            </Text>
          )}
          {event.time && <Text style={[styles.time, { color: colors.neutralVariant }]}>{event.time}</Text>}
          <View style={styles.ctaRow}>
            <View style={[styles.ctaButton, { backgroundColor: colors.primary }]}>
              <Text style={[styles.ctaText, { color: colors.onPrimary }]}>View Details</Text>
            </View>
          </View>
        </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardTablet: {
    flexDirection: 'row',
  },
  accentBlock: {
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  accentBlockTablet: {
    width: '40%',
    justifyContent: 'center',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  featuredBadgeText: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  dateDisplay: {
    marginTop: spacing.sm,
  },
  dateDisplayMonth: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
  },
  dateDisplayYear: {
    fontFamily: fonts.sans,
    fontSize: 14,
  },
  locationText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  content: {
    padding: spacing.xxl,
    gap: 10,
    flex: 1,
  },
  contentTablet: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.serifItalic,
    fontSize: 26,
    lineHeight: 32,
  },
  titleTablet: {
    fontSize: 30,
    lineHeight: 36,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
  time: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  ctaRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  ctaButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    borderRadius: radii.pill,
  },
  ctaText: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
  },
});
