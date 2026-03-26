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
import { homeColors, homeFonts, homeRadii } from '@/constants/homeTheme';

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
  const isTablet = width >= 768;

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <View style={[styles.textBlock, isTablet && imageSource && styles.textBlockTablet]}>
        {eyebrow && (
          <View style={styles.eyebrowPill}>
            <Text style={styles.eyebrowText}>{eyebrow}</Text>
          </View>
        )}
        <Text style={[styles.title, isTablet && styles.titleTablet]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.ctaRow}>
          <Link href={ctaHref} asChild>
            <TouchableOpacity style={styles.ctaPrimary}>
              <Text style={styles.ctaPrimaryText}>{ctaLabel}</Text>
            </TouchableOpacity>
          </Link>
          {secondaryCta && (
            <Link href={secondaryCta.href} asChild>
              <TouchableOpacity style={styles.ctaOutline}>
                <Text style={styles.ctaOutlineText}>{secondaryCta.label}</Text>
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
    backgroundColor: homeColors.primaryContainer,
    borderRadius: homeRadii.lg,
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
    borderRadius: homeRadii.pill,
  },
  eyebrowText: {
    fontFamily: homeFonts.sansBold,
    fontSize: 11,
    color: homeColors.onPrimary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: homeFonts.serifItalic,
    fontSize: 32,
    color: homeColors.onPrimary,
    lineHeight: 38,
  },
  titleTablet: {
    fontSize: 42,
    lineHeight: 48,
  },
  description: {
    fontFamily: homeFonts.sans,
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
    backgroundColor: homeColors.onPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: homeRadii.pill,
  },
  ctaPrimaryText: {
    fontFamily: homeFonts.sansBold,
    fontSize: 14,
    color: homeColors.primary,
  },
  ctaOutline: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: homeRadii.pill,
  },
  ctaOutlineText: {
    fontFamily: homeFonts.sansBold,
    fontSize: 14,
    color: homeColors.onPrimary,
  },
  imageBlock: {
    borderRadius: homeRadii.md,
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
