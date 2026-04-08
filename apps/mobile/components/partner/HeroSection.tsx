import { useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Linking, Platform } from 'react-native';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

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
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!headline && !subheadline && !imageUrl) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* Text column */}
        <View style={styles.textCol}>
          {headline && <Text style={styles.headline}>{headline}</Text>}
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
              style={styles.heroImage}
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
      paddingVertical: spacing.xxxl + 16,
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
      flex: 1,
      minWidth: 280,
      gap: spacing.lg,
    },
    headline: {
      fontFamily: fonts.sansBold,
      fontSize: 36,
      color: colors.neutral,
      lineHeight: 44,
    },
    subheadline: {
      fontFamily: fonts.sans,
      fontSize: fontSize.xl,
      color: colors.neutralVariant,
      lineHeight: 28,
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
  });
