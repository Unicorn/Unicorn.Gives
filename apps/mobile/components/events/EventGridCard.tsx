/**
 * Vertical event card for grid layouts. Shows a cover image (or gradient
 * fallback) with a calendar-widget date overlay, location row, title,
 * description, and RSVP / calendar CTAs.
 */
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { ContentCoverImage } from '@/components/ContentCoverImage';
import {
  fonts,
  fontSize,
  letterSpacing,
  lineHeight,
  radii,
  shadows,
  spacing,
  teal,
  useTheme,
} from '@/constants/theme';

interface EventGridCardProps {
  title: string;
  description?: string;
  location?: string;
  imageUrl?: string | null;
  dateBox?: { month: string; day: number; year: number };
  href: Href;
}

export function EventGridCard({
  title,
  description,
  location,
  imageUrl,
  dateBox,
  href,
}: EventGridCardProps) {
  const { colors } = useTheme();
  const hasImage = imageUrl != null && String(imageUrl).trim() !== '';

  return (
    <Link href={href} asChild>
      <Pressable style={styles.pressable}>
        <Card variant="elevated" hoverable style={styles.card}>
          {/* Cover area — fixed height with image or gradient fallback */}
          <View style={styles.imageWrap}>
            {hasImage ? (
              <ContentCoverImage
                imageUrl={imageUrl}
                variant="grid"
                accessibilityLabel={title}
                style={styles.coverImage}
              />
            ) : (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  styles.gradientFallback,
                  Platform.OS === 'web'
                    ? { backgroundImage: `linear-gradient(135deg, ${colors.heroBar} 0%, ${teal[800]} 100%)` } as any
                    : undefined,
                ]}
              >
                {Platform.OS !== 'web' && (
                  <>
                    <View style={[styles.gradientBase, { backgroundColor: colors.heroBar }]} />
                    <View style={[styles.gradientOverlay, { backgroundColor: teal[800] }]} />
                  </>
                )}
              </View>
            )}

            {/* Calendar widget */}
            {dateBox ? (
              <View style={[styles.calendarWidget, { backgroundColor: colors.surface }, shadows.card]}>
                <Text style={[styles.calMonth, { color: colors.primary }]}>
                  {dateBox.month}
                </Text>
                <Text style={[styles.calDay, { color: colors.neutral }]}>
                  {dateBox.day}
                </Text>
                <Text style={[styles.calYear, { color: colors.neutralVariant }]}>
                  {dateBox.year}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Body */}
          <View style={styles.body}>
            {location ? (
              <View style={styles.locationRow}>
                <MaterialIcons
                  name="location-on"
                  size={14}
                  color={colors.primary}
                />
                <Text
                  style={[styles.locationText, { color: colors.primary }]}
                  numberOfLines={1}
                >
                  {location}
                </Text>
              </View>
            ) : null}

            <Text style={[styles.title, { color: colors.neutral }]} numberOfLines={2}>
              {title}
            </Text>

            {description ? (
              <Text
                style={[styles.description, { color: colors.neutralVariant }]}
                numberOfLines={3}
              >
                {description}
              </Text>
            ) : null}

          </View>
        </Card>
      </Pressable>
    </Link>
  );
}

const IMAGE_HEIGHT = 180;

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    flex: 1,
  },
  imageWrap: {
    position: 'relative',
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  /* Gradient fallback (no-image) */
  gradientFallback: {
    overflow: 'hidden',
  },
  gradientBase: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.45,
    ...Platform.select({
      web: { transform: [{ translateX: '30%' as unknown as number }] },
      default: { transform: [{ translateX: 60 }] },
    }),
  },
  /* Calendar widget */
  calendarWidget: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    borderRadius: radii.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  calMonth: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
  calDay: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    lineHeight: 30,
    marginVertical: -1,
  },
  calYear: {
    fontFamily: fonts.sans,
    fontSize: 10,
  },
  /* Body */
  body: {
    padding: spacing.xl,
    gap: spacing.md,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
    flex: 1,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight.loose,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal,
  },
});
