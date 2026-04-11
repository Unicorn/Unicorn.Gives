/**
 * Full-bleed region hero using mode-aware teal colours
 * (light bg + dark text in light mode, dark bg + light text in dark mode).
 *
 * `imageUrl` and `featuredImageUrl` props are accepted for schema
 * compatibility but are currently ignored on the frontend so that every
 * hero renders with the same colour-based treatment.
 */
import { StyleSheet, Text, View } from 'react-native';
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
  /** Accepted for data-layer compat — not rendered. */
  imageUrl?: string | null;
  /** Accepted for data-layer compat — not rendered. */
  featuredImageUrl?: string | null;
  primaryCta?: { label: string; url: string } | null;
  secondaryCta?: { label: string; url: string } | null;
}

export function RegionHeroSection({
  eyebrow,
  headline,
  headlineAccent,
  subheadline,
  primaryCta,
  secondaryCta,
}: RegionHeroSectionProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const isTablet = width >= breakpoints.tablet;

  const textColor = colors.onHeroBackground;
  const subtextColor = colors.onHeroBackground;
  const pillBg = `${colors.onHeroBackground}14`;
  const ctaPrimaryBg = colors.onHeroBackground;
  const ctaPrimaryText = colors.heroBackground;
  const ctaSecondaryBorder = `${colors.onHeroBackground}50`;

  return (
    <View
      style={[
        styles.hero,
        { backgroundColor: colors.heroBackground, minHeight: isTablet ? 520 : 420 },
      ]}
    >
      <Container style={styles.containerInner}>
        <View style={styles.content}>
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
  content: {
    maxWidth: 720,
    gap: spacing.lg,
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
});
