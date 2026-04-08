import { View, Text, StyleSheet } from 'react-native';
import { useTheme, fonts, fontSize, letterSpacing, spacing, radii, shadows } from '@/constants/theme';

interface QuoteCalloutProps {
  quote: string;
  attribution?: string;
  variant?: 'centered' | 'aside';
}

export function QuoteCallout({
  quote,
  attribution,
  variant = 'centered',
}: QuoteCalloutProps) {
  const { colors } = useTheme();
  const isCentered = variant === 'centered';

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.surface,
          { backgroundColor: colors.surface },
          shadows.cardElevated,
        ]}
      >
        <View style={[styles.inner, isCentered && styles.innerCentered]}>
          {isCentered && (
            <View
              style={[styles.bar, { backgroundColor: colors.primary }, styles.barCentered]}
            />
          )}
          <Text
            style={[
              styles.quote,
              { color: colors.neutral },
              isCentered && styles.quoteCentered,
              !isCentered && styles.quoteAside,
            ]}
          >
            {quote}
          </Text>
          {attribution && (
            <Text
              style={[
                styles.attribution,
                { color: colors.neutralVariant },
                isCentered && styles.attributionCentered,
              ]}
            >
              {attribution}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  surface: {
    borderRadius: radii.md,
    paddingVertical: spacing.xxl - 2,
    paddingHorizontal: spacing.xl,
  },
  inner: {
    gap: spacing.md,
  },
  innerCentered: {
    alignItems: 'center',
  },
  bar: {
    width: 48,
    height: 3,
    borderRadius: 2,
  },
  barCentered: {
    alignSelf: 'center',
  },
  quote: {
    fontFamily: fonts.serifItalic,
    lineHeight: 32,
  },
  quoteCentered: {
    fontSize: fontSize['3xl'],
    textAlign: 'center',
    maxWidth: 600,
  },
  quoteAside: {
    fontSize: fontSize.xl + 2,
  },
  attribution: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
  attributionCentered: {
    textAlign: 'center',
  },
});
