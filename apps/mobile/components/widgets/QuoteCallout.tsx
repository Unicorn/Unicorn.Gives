import { View, Text, StyleSheet } from 'react-native';
import { useTheme, fonts } from '@/constants/theme';

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
    <View style={[styles.container, isCentered && styles.centered]}>
      <View
        style={[styles.bar, { backgroundColor: colors.gold }, isCentered && styles.barCentered]}
      />
      <Text
        style={[
          styles.quote,
          { color: colors.neutral },
          isCentered && styles.quoteCentered,
          !isCentered && [styles.quoteAside, { borderLeftColor: colors.gold }],
        ]}
      >
        {quote}
      </Text>
      {attribution && (
        <Text style={[styles.attribution, { color: colors.neutralVariant }, isCentered && styles.attributionCentered]}>
          {attribution}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    gap: 12,
  },
  centered: {
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
    fontSize: 24,
    textAlign: 'center',
    maxWidth: 600,
  },
  quoteAside: {
    fontSize: 20,
    borderLeftWidth: 3,
    paddingLeft: 16,
  },
  attribution: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  attributionCentered: {
    textAlign: 'center',
  },
});
