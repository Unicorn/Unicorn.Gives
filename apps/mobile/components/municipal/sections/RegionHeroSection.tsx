/**
 * Full-bleed region hero. Background image + dark gradient overlay, eyebrow
 * pill, serif headline with optional italic accent phrase, subheadline, and
 * up to two CTAs. Falls back to a solid heroBar background when no image.
 */
import { Image, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
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
  imageUrl?: string | null;
  primaryCta?: { label: string; url: string } | null;
  secondaryCta?: { label: string; url: string } | null;
}

export function RegionHeroSection({
  eyebrow,
  headline,
  headlineAccent,
  subheadline,
  imageUrl,
  primaryCta,
  secondaryCta,
}: RegionHeroSectionProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const isTablet = width >= breakpoints.tablet;

  return (
    <View
      style={[
        styles.hero,
        { backgroundColor: colors.heroBar, minHeight: isTablet ? 520 : 420 },
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityLabel={headline || 'Region hero image'}
        />
      ) : null}
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
      />

      <View style={[styles.content, isTablet && styles.contentTablet]}>
        {eyebrow ? (
          <View style={[styles.eyebrowPill, { backgroundColor: 'rgba(255,255,255,0.16)' }]}>
            <Text style={[styles.eyebrowText, { color: '#fff' }]}>{eyebrow}</Text>
          </View>
        ) : null}

        {headline ? (
          <Text style={[styles.headline, isTablet && styles.headlineTablet]}>
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
          <Text style={[styles.subheadline, isTablet && styles.subheadlineTablet]}>
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
                    { backgroundColor: '#fff' },
                  ])}
                >
                  <Text style={[styles.ctaPrimaryText, { color: colors.neutral }]}>
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
                    { borderColor: 'rgba(255,255,255,0.5)' },
                  ])}
                >
                  <Text style={[styles.ctaSecondaryText, { color: '#fff' }]}>
                    {secondaryCta.label}
                  </Text>
                </AnimatedPressable>
              </Link>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl + spacing.xl,
  },
  content: {
    maxWidth: 720,
    gap: spacing.lg,
  },
  contentTablet: {
    paddingLeft: spacing.xxxl,
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
    color: '#fff',
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
    color: 'rgba(255,255,255,0.9)',
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
});
