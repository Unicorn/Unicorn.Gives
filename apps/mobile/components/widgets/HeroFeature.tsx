import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { useTheme, fonts, radii } from '@/constants/theme';

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
  const isTablet = width >= 768;

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryContainer }, isTablet && styles.containerTablet]}>
      <View style={[styles.textBlock, (isTablet && imageSource) ? styles.textBlockTablet : undefined]}>
        {eyebrow && (
          <View style={styles.eyebrowPill}>
            <Text style={[styles.eyebrowText, { color: colors.onPrimary }]}>{eyebrow}</Text>
          </View>
        )}
        <Text style={[styles.title, { color: colors.onPrimary }, isTablet && styles.titleTablet]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.ctaRow}>
          <Link href={ctaHref} asChild>
            <TouchableOpacity style={StyleSheet.flatten([styles.ctaPrimary, { backgroundColor: colors.onPrimary }])}>
              <Text style={[styles.ctaPrimaryText, { color: colors.primary }]}>{ctaLabel}</Text>
            </TouchableOpacity>
          </Link>
          {secondaryCta && (
            <Link href={secondaryCta.href} asChild>
              <TouchableOpacity style={styles.ctaOutline}>
                <Text style={[styles.ctaOutlineText, { color: colors.onPrimary }]}>{secondaryCta.label}</Text>
              </TouchableOpacity>
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
    overflow: 'hidden',
    padding: 24,
    gap: 20,
  },
  containerTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 32,
    gap: 32,
  },
  textBlock: {
    flex: 1,
    gap: 12,
  },
  textBlockTablet: {
    flex: 1,
  },
  eyebrowPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  eyebrowText: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.5,
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
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 23,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radii.pill,
  },
  ctaPrimaryText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  ctaOutline: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radii.pill,
  },
  ctaOutlineText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
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
