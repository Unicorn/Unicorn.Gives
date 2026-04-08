/**
 * Simple about section: title + body, optional image on the side at tablet
 * widths. Body is rendered as plain text — a richer markdown renderer can be
 * swapped in later if needed.
 */
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  breakpoints,
  fonts,
  fontSize,
  spacing,
  radii,
  useTheme,
} from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';

interface RegionAboutSectionProps {
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
}

export function RegionAboutSection({ title, body, imageUrl }: RegionAboutSectionProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const isTablet = width >= breakpoints.tablet;

  if (!title && !body && !imageUrl) return null;

  return (
    <View style={styles.section}>
      <View
        style={[
          styles.inner,
          isTablet && imageUrl ? styles.innerTablet : undefined,
        ]}
      >
        <View style={styles.textCol}>
          {title ? (
            <Text style={[styles.title, { color: colors.neutral }]}>{title}</Text>
          ) : null}
          {body ? (
            <Text style={[styles.body, { color: colors.neutralVariant }]}>{body}</Text>
          ) : null}
        </View>
        {imageUrl ? (
          <View style={[styles.imageCol, isTablet && styles.imageColTablet]}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={title || 'About image'}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: spacing.xxxl + spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  inner: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    gap: spacing.xxl,
  },
  innerTablet: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
    gap: spacing.md,
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
  imageCol: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    height: 240,
  },
  imageColTablet: {
    flex: 1,
    height: 360,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
