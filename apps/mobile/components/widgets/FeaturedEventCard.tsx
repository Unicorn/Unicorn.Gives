import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';
import { Link } from 'expo-router';
import { ContentCoverImage } from '@/components/ContentCoverImage';
import type { EventItem } from '@/components/events/eventTypes';
import { routes } from '@/lib/navigation';
import { breakpoints, useTheme, fonts, fontSize, letterSpacing, spacing, radii, shadows } from '@/constants/theme';

interface FeaturedEventCardProps {
  event: EventItem & { description?: string | null; location?: string | null };
}

export function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  const { width } = useWindowDimensions();
  const { colors, chips } = useTheme();
  const isTablet = width >= breakpoints.tablet;

  const d = new Date(event.date + 'T00:00:00');
  const monthDay = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const year = d.getFullYear();

  const cardStyle = StyleSheet.flatten([
    styles.card,
    { backgroundColor: colors.surface },
  ]) as ViewStyle;

  return (
    <Link href={routes.community.events.detail(event.slug)} style={cardStyle}>
        <ContentCoverImage
          imageUrl={event.image_url}
          variant="card"
          accessibilityLabel={event.title}
          style={styles.featuredCover}
        />
        <View style={isTablet ? styles.tabletBody : undefined}>
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
        </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  featuredCover: {
    height: 176,
  },
  card: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  tabletBody: {
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
    fontSize: fontSize.xs - 1,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  dateDisplay: {
    marginTop: spacing.sm,
  },
  dateDisplayMonth: {
    fontFamily: fonts.serifBold,
    fontSize: fontSize['2xl'],
  },
  dateDisplayYear: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
  locationText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm + 1,
    marginTop: spacing.xs,
  },
  content: {
    padding: spacing.xxl,
    gap: spacing.sm + 2,
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
    fontSize: fontSize['5xl'],
    lineHeight: 36,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    lineHeight: 21,
  },
  time: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.sm + 1,
  },
  ctaRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  ctaButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.pill,
  },
  ctaText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.sm + 1,
  },
});
