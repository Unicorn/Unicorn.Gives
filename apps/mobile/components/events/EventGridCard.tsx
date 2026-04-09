/**
 * Vertical event card for grid layouts. Shows a cover image with date badge
 * overlay, location row, title, description, and RSVP / calendar CTAs.
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
  spacing,
  teal,
  useTheme,
} from '@/constants/theme';

interface EventGridCardProps {
  title: string;
  description?: string;
  location?: string;
  imageUrl?: string | null;
  dateLabel?: string; // e.g. "Oct 24"
  href: Href;
  onRsvp?: () => void;
  onAddToCalendar?: () => void;
}

export function EventGridCard({
  title,
  description,
  location,
  imageUrl,
  dateLabel,
  href,
  onRsvp,
  onAddToCalendar,
}: EventGridCardProps) {
  const { colors } = useTheme();
  const hasImage = imageUrl != null && String(imageUrl).trim() !== '';

  return (
    <Link href={href} asChild>
      <Pressable style={styles.pressable}>
        <Card variant="elevated" style={styles.card}>
          {/* Cover area — fixed height with image or gradient fallback */}
          <View
            style={[
              styles.imageWrap,
              !hasImage && styles.gradientFallback,
            ]}
          >
            {hasImage ? (
              <ContentCoverImage
                imageUrl={imageUrl}
                variant="grid"
                accessibilityLabel={title}
                style={styles.coverImage}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.gradientLayers]}>
                <View style={[styles.gradientBase, { backgroundColor: colors.heroBar }]} />
                <View style={[styles.gradientOverlay, { backgroundColor: teal[800] }]} />
              </View>
            )}
            {dateLabel ? (
              <View style={[styles.dateBadge, { backgroundColor: hasImage ? colors.primary : 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.dateBadgeText}>{dateLabel}</Text>
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

            {/* CTAs */}
            <View style={styles.ctaColumn}>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onRsvp?.();
                }}
                style={[styles.ctaPrimary, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.ctaPrimaryText}>RSVP</Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onAddToCalendar?.();
                }}
                style={[styles.ctaSecondary, { borderColor: colors.outline }]}
              >
                <Text style={[styles.ctaSecondaryText, { color: colors.primary }]}>
                  Add to Calendar
                </Text>
              </Pressable>
            </View>
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
  gradientFallback: {
    // container is already positioned via height
  },
  gradientLayers: {
    overflow: 'hidden',
  },
  gradientBase: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
    ...Platform.select({
      web: { transform: [{ translateX: '30%' as unknown as number }] },
      default: { transform: [{ translateX: 60 }] },
    }),
  },
  dateBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm - 4,
  },
  dateBadgeText: {
    color: '#ffffff',
    fontFamily: fonts.sansBold,
    fontSize: fontSize.sm,
  },
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
  ctaColumn: {
    marginTop: 'auto' as any,
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  ctaPrimary: {
    paddingVertical: spacing.md,
    borderRadius: radii.sm - 4,
    alignItems: 'center',
  },
  ctaPrimaryText: {
    color: '#ffffff',
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
  },
  ctaSecondary: {
    paddingVertical: spacing.md,
    borderRadius: radii.sm - 4,
    borderWidth: 1,
    alignItems: 'center',
  },
  ctaSecondaryText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
  },
});
