/**
 * Renders a single custom section from a region landing page. Supports
 * markdown (title + body + optional image), gallery (grid of images with
 * captions), quote (pullquote + author), and cta (title + body + button).
 */
import { Image, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import {
  breakpoints,
  fonts,
  fontSize,
  radii,
  spacing,
  useTheme,
} from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { toHref } from '@/lib/navigation/paths';
import type { CustomSectionItem } from '@/lib/municipal/regionLanding';

interface RegionCustomSectionProps {
  item: CustomSectionItem;
}

export function RegionCustomSection({ item }: RegionCustomSectionProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const isTablet = width >= breakpoints.tablet;

  switch (item.type) {
    case 'markdown':
      return (
        <View style={styles.section}>
          <View style={styles.inner}>
            {item.title ? (
              <Text style={[styles.title, { color: colors.neutral }]}>{item.title}</Text>
            ) : null}
            {item.body ? (
              <Text style={[styles.body, { color: colors.neutralVariant }]}>
                {item.body}
              </Text>
            ) : null}
            {item.image_url ? (
              <Image
                source={{ uri: item.image_url }}
                style={styles.markdownImage}
                resizeMode="cover"
                accessibilityLabel={item.title || ''}
              />
            ) : null}
          </View>
        </View>
      );

    case 'gallery':
      if (!item.images?.length) return null;
      return (
        <View style={styles.section}>
          <View style={styles.inner}>
            {item.title ? (
              <Text style={[styles.title, { color: colors.neutral }]}>{item.title}</Text>
            ) : null}
            <View style={[styles.galleryGrid, isTablet && styles.galleryGridTablet]}>
              {item.images.map((img, i) => (
                <View key={i} style={[styles.galleryCell, isTablet && styles.galleryCellTablet]}>
                  <Image
                    source={{ uri: img.url }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                    accessibilityLabel={img.caption || ''}
                  />
                  {img.caption ? (
                    <Text style={[styles.caption, { color: colors.neutralVariant }]}>
                      {img.caption}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        </View>
      );

    case 'quote':
      return (
        <View style={styles.section}>
          <View style={[styles.inner, styles.quoteInner]}>
            <Text style={[styles.quoteMark, { color: colors.primary }]}>&ldquo;</Text>
            {item.quote ? (
              <Text style={[styles.quote, { color: colors.neutral }]}>{item.quote}</Text>
            ) : null}
            {item.author ? (
              <Text style={[styles.quoteAuthor, { color: colors.neutralVariant }]}>
                — {item.author}
              </Text>
            ) : null}
          </View>
        </View>
      );

    case 'cta':
      return (
        <View style={styles.section}>
          <View
            style={[
              styles.ctaCard,
              { backgroundColor: colors.primary },
            ]}
          >
            {item.title ? (
              <Text style={[styles.ctaTitle, { color: colors.onPrimary }]}>
                {item.title}
              </Text>
            ) : null}
            {item.body ? (
              <Text style={[styles.ctaBody, { color: colors.onPrimary }]}>
                {item.body}
              </Text>
            ) : null}
            {item.cta_label && item.cta_url ? (
              <Link href={toHref(item.cta_url) as never} asChild>
                <AnimatedPressable
                  variant="button"
                  style={StyleSheet.flatten([
                    styles.ctaButton,
                    { backgroundColor: '#fff' },
                  ])}
                >
                  <Text style={[styles.ctaButtonText, { color: colors.primary }]}>
                    {item.cta_label}
                  </Text>
                </AnimatedPressable>
              </Link>
            ) : null}
          </View>
        </View>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  inner: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
    gap: spacing.lg,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 32,
    lineHeight: 38,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
    lineHeight: 26,
  },
  markdownImage: {
    width: '100%',
    height: 320,
    borderRadius: radii.md,
  },

  galleryGrid: {
    gap: spacing.md,
  },
  galleryGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  galleryCell: {
    gap: spacing.xs,
  },
  galleryCellTablet: {
    flexBasis: '31%',
    flexGrow: 1,
    minWidth: 200,
  },
  galleryImage: {
    width: '100%',
    height: 200,
    borderRadius: radii.md,
  },
  caption: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
  },

  quoteInner: {
    maxWidth: 780,
    alignItems: 'center',
  },
  quoteMark: {
    fontFamily: fonts.serifBold,
    fontSize: 96,
    lineHeight: 80,
  },
  quote: {
    fontFamily: fonts.serifItalic,
    fontSize: 28,
    lineHeight: 38,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },

  ctaCard: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
    borderRadius: radii.lg,
    padding: spacing.xxxl,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  ctaTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 28,
    lineHeight: 34,
  },
  ctaBody: {
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
    lineHeight: 24,
    opacity: 0.9,
  },
  ctaButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
  },
  ctaButtonText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
  },
});
