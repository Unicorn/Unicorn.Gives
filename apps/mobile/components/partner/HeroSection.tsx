import { useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Linking, Platform } from 'react-native';
import {
  useTheme,
  fonts,
  fontSize,
  spacing,
  radii,
  letterSpacing,
  breakpoints,
  type ThemeColors,
} from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';

function handleCtaPress(ctaUrl: string) {
  // In-page anchor: scroll to the matching element on web; no-op on native.
  if (ctaUrl.startsWith('#')) {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const el = document.getElementById(ctaUrl.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    return;
  }
  Linking.openURL(ctaUrl);
}

interface HeroSectionProps {
  headline?: string | null;
  subheadline?: string | null;
  imageUrl?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

export function HeroSection({ headline, subheadline, imageUrl, ctaLabel, ctaUrl }: HeroSectionProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const compact = width > 0 && width < breakpoints.tablet;
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!headline && !subheadline && !imageUrl) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* Text column */}
        <View style={styles.textCol}>
          {headline && (
            <Text style={[styles.headline, compact && styles.headlineCompact]}>{headline}</Text>
          )}
          {subheadline && <Text style={styles.subheadline}>{subheadline}</Text>}
          {ctaLabel && ctaUrl && (
            <Pressable
              style={styles.cta}
              onPress={() => handleCtaPress(ctaUrl)}
              {...(Platform.OS === 'web' && ctaUrl.startsWith('#')
                ? ({ accessibilityRole: 'link', href: ctaUrl } as object)
                : {})}
            >
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </Pressable>
          )}
        </View>

        {/* Image column */}
        {imageUrl && (
          <View style={styles.imageCol}>
            <Image
              source={{ uri: imageUrl }}
              style={[styles.heroImage, compact && styles.heroImageCompact]}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxxl * 2.5,
    },
    inner: {
      maxWidth: 1000,
      alignSelf: 'center',
      width: '100%' as any,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.xxxl,
    },
    textCol: {
      // Gives the words more of the row than the image.
      flex: 1.25,
      minWidth: 280,
      gap: spacing.lg,
    },
    headline: {
      // The brand's display voice: Newsreader, set large and tracked in.
      fontFamily: fonts.serifBold,
      fontSize: 60,
      lineHeight: 64,
      letterSpacing: letterSpacing.display,
      color: colors.neutral,
    },
    headlineCompact: {
      fontSize: 40,
      lineHeight: 44,
    },
    subheadline: {
      fontFamily: fonts.sans,
      fontSize: fontSize.xl,
      color: colors.neutralVariant,
      lineHeight: 28,
      // Holds the line length inside a readable measure on wide screens.
      maxWidth: 480,
    },
    cta: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.md + 2,
      borderRadius: radii.sm,
      alignSelf: 'flex-start',
      marginTop: spacing.sm,
    },
    ctaText: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.md,
      color: colors.onPrimary,
    },
    imageCol: {
      flex: 1,
      minWidth: 280,
      alignItems: 'center',
    },
    heroImage: {
      width: '100%' as any,
      aspectRatio: 1,
      maxWidth: 420,
      maxHeight: 420,
    },
    heroImageCompact: {
      // At phone width a square image otherwise fills the viewport and pushes
      // the first real content below the fold.
      maxHeight: 240,
    },
  });
