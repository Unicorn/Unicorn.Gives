import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { breakpoints, useTheme, fonts, fontSize, letterSpacing, spacing, radii, shadows } from '@/constants/theme';

interface HeroFeatureProps {
  title: string;
  eyebrow?: string;
  description: string;
  ctaLabel: string;
  ctaHref: Href;
  secondaryCta?: { label: string; href: Href };
  imageSource?: ImageSourcePropType;
}

export function HeroFeature({
  title,
  eyebrow,
  description,
  ctaLabel,
  ctaHref,
  secondaryCta,
  imageSource,
}: HeroFeatureProps) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isTablet = width >= breakpoints.tablet;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        shadows.cardElevated,
        isTablet && styles.containerTablet,
      ]}
    >
      <View style={[styles.textBlock, (isTablet && imageSource) ? styles.textBlockTablet : undefined]}>
        {eyebrow && (
          <View style={styles.eyebrowPill}>
            <Text style={[styles.eyebrowText, { color: colors.neutralVariant }]}>{eyebrow}</Text>
          </View>
        )}
        <Text style={[styles.title, { color: colors.neutral }, isTablet && styles.titleTablet]}>{title}</Text>
        <Text style={[styles.description, { color: colors.neutralVariant }]}>{description}</Text>
        <View style={styles.ctaRow}>
          <Link href={ctaHref} asChild>
            <AnimatedPressable variant="button" style={StyleSheet.flatten([styles.ctaPrimary, { backgroundColor: colors.primary }, shadows.button])}>
              <Text style={[styles.ctaPrimaryText, { color: colors.onPrimary }]}>{ctaLabel}</Text>
            </AnimatedPressable>
          </Link>
          {secondaryCta && (
            <Link href={secondaryCta.href} asChild>
              <AnimatedPressable variant="button" style={StyleSheet.flatten([styles.ctaOutline, { borderColor: colors.outline }])}>
                <Text style={[styles.ctaOutlineText, { color: colors.neutral }]}>{secondaryCta.label}</Text>
              </AnimatedPressable>
            </Link>
          )}
        </View>
      </View>
      {imageSource && (
        <View style={[styles.imageBlock, isTablet && styles.imageBlockTablet]}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={title}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.lg,
    padding: spacing.xxl,
    gap: spacing.xl,
  },
  containerTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xxxl,
    gap: spacing.xxxl,
  },
  textBlock: {
    flex: 1,
    gap: spacing.md,
  },
  textBlockTablet: {
    flex: 1,
  },
  eyebrowPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  eyebrowText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.serifItalic,
    fontSize: 32,
    lineHeight: 38,
  },
  titleTablet: {
    fontSize: 42,
    lineHeight: 48,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
    lineHeight: 23,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
  },
  ctaPrimaryText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
  },
  ctaOutline: {
    borderWidth: 1.5,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
  },
  ctaOutlineText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
  },
  imageBlock: {
    borderRadius: radii.md,
    overflow: 'hidden',
    height: 200,
  },
  imageBlockTablet: {
    flex: 1,
    height: 280,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
