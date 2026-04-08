import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { ContentCoverImage } from '@/components/ContentCoverImage';
import {
  breakpoints,
  fonts,
  fontSize,
  radii,
  shadows,
  spacing,
  useTheme,
} from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';
import { eventDateBoxFromIso } from '@/lib/events/eventDateFormat';

export interface FeaturedContentCardProps {
  href: Href;
  title: string;
  description?: string | null;
  /** ISO date YYYY-MM-DD */
  date: string;
  time?: string | null;
  location?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  ctaLabel?: string;
}

/**
 * Shared featured hero card used by both events and news.
 * Shows a large cover image, a wide accent column with a full-width
 * calendar date box (month / day / year), optional time, location, and
 * category, plus a content column with title, description, and CTA.
 */
export function FeaturedContentCard({
  href,
  title,
  description,
  date,
  time,
  location,
  category,
  imageUrl,
  ctaLabel = 'View details',
}: FeaturedContentCardProps) {
  const { colors, chips } = useTheme();
  const { width } = useHydratedDimensions();
  const isTablet = width >= breakpoints.tablet;

  const dateBox = eventDateBoxFromIso(date);
  const year = new Date(`${date}T00:00:00`).getFullYear();

  const cardStyle = StyleSheet.flatten([
    styles.card,
    { backgroundColor: colors.surface },
  ]) as ViewStyle;

  return (
    <Link href={href} style={cardStyle as never}>
      <ContentCoverImage
        imageUrl={imageUrl}
        variant="card"
        accessibilityLabel={title}
        style={styles.cover}
      />
      <View style={isTablet ? styles.body : undefined}>
        <View
          style={StyleSheet.flatten([
            styles.accent,
            isTablet ? styles.accentTablet : undefined,
          ])}
        >
          <View
            style={StyleSheet.flatten([
              styles.badge,
              {
                backgroundColor: chips.gold.backgroundColor,
                borderColor: chips.gold.borderColor,
              },
            ])}
          >
            <Text
              style={StyleSheet.flatten([
                styles.badgeText,
                { color: chips.gold.color },
              ])}
            >
              Featured
            </Text>
          </View>

          <View
            style={StyleSheet.flatten([
              styles.dateBox,
              { borderColor: colors.neutral },
            ])}
          >
            <Text
              style={StyleSheet.flatten([
                styles.dateMonth,
                { color: colors.neutralVariant },
              ])}
            >
              {dateBox.month}
            </Text>
            <Text
              style={StyleSheet.flatten([
                styles.dateDay,
                { color: colors.neutral },
              ])}
            >
              {dateBox.day}
            </Text>
            <Text
              style={StyleSheet.flatten([
                styles.dateYear,
                { color: colors.neutralVariant },
              ])}
            >
              {year}
            </Text>
          </View>

          {time ? (
            <Text
              style={StyleSheet.flatten([
                styles.metaText,
                { color: colors.neutralVariant },
              ])}
            >
              {time}
            </Text>
          ) : null}
          {location ? (
            <Text
              style={StyleSheet.flatten([
                styles.metaText,
                { color: colors.neutralVariant },
              ])}
              numberOfLines={2}
            >
              {location}
            </Text>
          ) : null}
          {category ? (
            <Text
              style={StyleSheet.flatten([
                styles.category,
                { color: colors.neutralVariant },
              ])}
            >
              {category.replace(/-/g, ' ').toUpperCase()}
            </Text>
          ) : null}
        </View>

        <View
          style={StyleSheet.flatten([
            styles.content,
            isTablet ? styles.contentTablet : undefined,
          ])}
        >
          <Text
            style={StyleSheet.flatten([
              styles.title,
              { color: colors.neutral },
              isTablet ? styles.titleTablet : undefined,
            ])}
          >
            {title}
          </Text>
          {description ? (
            <Text
              style={StyleSheet.flatten([
                styles.description,
                { color: colors.neutralVariant },
              ])}
              numberOfLines={3}
            >
              {description}
            </Text>
          ) : null}
          <View style={styles.ctaRow}>
            <View
              style={StyleSheet.flatten([
                styles.cta,
                { backgroundColor: colors.primary },
              ])}
            >
              <Text
                style={StyleSheet.flatten([
                  styles.ctaText,
                  { color: colors.onPrimary },
                ])}
              >
                {ctaLabel}
              </Text>
            </View>
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
  cover: {
    height: 220,
  },
  body: {
    flexDirection: 'row',
  },
  accent: {
    padding: spacing.xxl,
    gap: spacing.md,
  },
  accentTablet: {
    width: '45%',
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xs - 1,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  dateBox: {
    width: '100%',
    borderRadius: radii.md,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  dateMonth: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.sm,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize['5xl'],
    lineHeight: fontSize['5xl'] + 4,
  },
  dateYear: {
    fontFamily: fonts.sans,
    fontSize: fontSize.xs,
    letterSpacing: 1,
  },
  metaText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm + 1,
  },
  category: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: 1,
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
  ctaRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.pill,
  },
  ctaText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.sm + 1,
  },
});
