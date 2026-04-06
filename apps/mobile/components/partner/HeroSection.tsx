import { useMemo } from 'react';
import { View, Text, Pressable, ImageBackground, StyleSheet, Linking } from 'react-native';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

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

  const content = (
    <View style={styles.overlay}>
      <View style={styles.inner}>
        {headline && <Text style={styles.headline}>{headline}</Text>}
        {subheadline && <Text style={styles.subheadline}>{subheadline}</Text>}
        {ctaLabel && ctaUrl && (
          <Pressable style={styles.cta} onPress={() => Linking.openURL(ctaUrl)}>
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  if (imageUrl) {
    return (
      <ImageBackground source={{ uri: imageUrl }} style={styles.container} resizeMode="cover">
        {content}
      </ImageBackground>
    );
  }

  return <View style={[styles.container, styles.noImage]}>{content}</View>;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      minHeight: 340,
      justifyContent: 'center',
    },
    noImage: {
      backgroundColor: colors.primaryContainer,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
    },
    inner: {
      maxWidth: 700,
      alignSelf: 'center',
      alignItems: 'center',
    },
    headline: {
      fontFamily: fonts.sansBold,
      fontSize: 36,
      color: '#fff',
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    subheadline: {
      fontFamily: fonts.sans,
      fontSize: fontSize.lg,
      color: 'rgba(255,255,255,0.9)',
      textAlign: 'center',
      lineHeight: 28,
      marginBottom: spacing.xl,
    },
    cta: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl + 4,
      paddingVertical: spacing.md,
      borderRadius: radii.sm,
    },
    ctaText: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.md,
      color: colors.onPrimary,
    },
  });
