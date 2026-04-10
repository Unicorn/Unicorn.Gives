/**
 * Full-bleed region hero. When a background image is provided the hero renders
 * a dark overlay with white text. Without an image it uses mode-aware teal
 * (light bg + dark text in light mode, dark bg + light text in dark mode).
 *
 * An optional `featuredImageUrl` renders a right-side image on tablet+.
 */
import { Image, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Container } from '@/components/layout/Container';
import {
  breakpoints,
  fonts,
  fontSize,
  letterSpacing,
  radii,
  spacing,
  useTheme,
} from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { toHref } from '@/lib/navigation/paths';

interface RegionHeroSectionProps {
  eyebrow?: string | null;
  headline?: string | null;
  headlineAccent?: string | null;
  subheadline?: string | null;
  /** Full-bleed background image with dark overlay. */
  imageUrl?: string | null;
  /** Right-side featured image, visible on tablet+ only. */
  featuredImageUrl?: string | null;
  primaryCta?: { label: string; url: string } | null;
  secondaryCta?: { label: string; url: string } | null;
}

export function RegionHeroSection({
  eyebrow,
  headline,
  headlineAccent,
  subheadline,
  imageUrl,
  featuredImageUrl,
  primaryCta,
  secondaryCta,
}: RegionHeroSectionProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const isTablet = width >= breakpoints.tablet;

  // When a background image is present the overlay makes the hero dark
  // regardless of theme mode, so we always use white text.
  const hasImage = !!imageUrl;
  const textColor = hasImage ? '#fff' : colors.onHeroBackground;
  const subtextColor = hasImage ? 'rgba(255,255,255,0.9)' : colors.onHeroBackground;
  const pillBg = hasImage ? 'rgba(255,255,255,0.16)' : `${colors.onHeroBackground}14`;
  const ctaPrimaryBg = hasImage ? '#fff' : colors.onHeroBackground;
  const ctaPrimaryText = hasImage ? '#1a1a1a' : colors.heroBackground;
  const ctaSecondaryBorder = hasImage
    ? 'rgba(255,255,255,0.5)'
    : `${colors.onHeroBackground}50`;
  const bg = hasImage ? colors.heroBar : colors.heroBackground;

  const showFeaturedImage = !!featuredImageUrl && isTablet;

  return (
    <View
      style={[
        styles.hero,
        { backgroundColor: bg, minHeight: isTablet ? 520 : 420 },
      ]}
    >
      {hasImage ? (
        <>
          <Image
            source={{ uri: imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            accessibilityLabel={headline || 'Region hero image'}
          />
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
          />
        </>
      ) : null}

      <Container style={styles.containerInner}>
        <View style={[styles.row, showFeaturedImage && styles.rowTablet]}>
          {/* Text column */}
          <View style={[styles.content, isTablet && styles.contentTablet]}>
            {eyebrow ? (
              <View style={[styles.eyebrowPill, { backgroundColor: pillBg }]}>
                <Text style={[styles.eyebrowText, { color: textColor }]}>{eyebrow}</Text>
              </View>
            ) : null}

            {headline ? (
              <Text
                style={[
                  styles.headline,
                  { color: textColor },
                  isTablet && styles.headlineTablet,
                ]}
              >
                {headline}
                {headlineAccent ? (
                  <>
                    {' '}
                    <Text style={styles.headlineAccent}>{headlineAccent}</Text>
                  </>
                ) : null}
              </Text>
            ) : null}

            {subheadline ? (
              <Text
                style={[
                  styles.subheadline,
                  { color: subtextColor },
                  isTablet && styles.subheadlineTablet,
                ]}
              >
                {subheadline}
              </Text>
            ) : null}

            {(primaryCta || secondaryCta) && (
              <View style={styles.ctaRow}>
                {primaryCta ? (
                  <Link href={toHref(primaryCta.url) as never} asChild>
                    <AnimatedPressable
                      variant="button"
                      style={StyleSheet.flatten([
                        styles.ctaPrimary,
                        { backgroundColor: ctaPrimaryBg },
                      ])}
                    >
                      <Text style={[styles.ctaPrimaryText, { color: ctaPrimaryText }]}>
                        {primaryCta.label}
                      </Text>
                    </AnimatedPressable>
                  </Link>
                ) : null}
                {secondaryCta ? (
                  <Link href={toHref(secondaryCta.url) as never} asChild>
                    <AnimatedPressable
                      variant="button"
                      style={StyleSheet.flatten([
                        styles.ctaSecondary,
                        { borderColor: ctaSecondaryBorder },
                      ])}
                    >
                      <Text style={[styles.ctaSecondaryText, { color: textColor }]}>
                        {secondaryCta.label}
                      </Text>
                    </AnimatedPressable>
                  </Link>
                ) : null}
              </View>
            )}
          </View>

          {/* Featured image (tablet+ only) */}
          {showFeaturedImage ? (
            <View style={styles.featuredImageCol}>
              <Image
                source={{ uri: featuredImageUrl! }}
                style={styles.featuredImage}
                resizeMode="cover"
                accessibilityLabel={headline || 'Featured image'}
              />
            </View>
          ) : null}
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl + spacing.xl,
  },
  containerInner: {
    justifyContent: 'center',
  },
  row: {
    // Single column by default
  },
  rowTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxxl,
  },
  content: {
    maxWidth: 720,
    gap: spacing.lg,
    flex: 1,
  },
  contentTablet: {
    gap: spacing.xl,
  },
  eyebrowPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
  },
  eyebrowText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
  headline: {
    fontFamily: fonts.serifBold,
    fontSize: 40,
    lineHeight: 44,
  },
  headlineTablet: {
    fontSize: 64,
    lineHeight: 66,
  },
  headlineAccent: {
    fontFamily: fonts.serifItalic,
    fontWeight: '300',
  },
  subheadline: {
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
    lineHeight: 24,
    maxWidth: 560,
  },
  subheadlineTablet: {
    fontSize: fontSize.xl,
    lineHeight: 28,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  ctaPrimary: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md + 2,
    borderRadius: radii.sm,
  },
  ctaPrimaryText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
  },
  ctaSecondary: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md + 2,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  ctaSecondaryText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
  },
  featuredImageCol: {
    flex: 1,
    maxWidth: 420,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 360,
  },
});
