import { View, Text, StyleSheet } from 'react-native';
import { homeColors, homeFonts } from '@/constants/homeTheme';

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
  const isCentered = variant === 'centered';

  return (
    <View style={[styles.container, isCentered && styles.centered]}>
      <View
        style={[styles.bar, isCentered && styles.barCentered]}
      />
      <Text
        style={[
          styles.quote,
          isCentered && styles.quoteCentered,
          !isCentered && styles.quoteAside,
        ]}
      >
        {quote}
      </Text>
      {attribution && (
        <Text style={[styles.attribution, isCentered && styles.attributionCentered]}>
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
    backgroundColor: homeColors.accent,
    borderRadius: 2,
  },
  barCentered: {
    alignSelf: 'center',
  },
  quote: {
    fontFamily: homeFonts.serifItalic,
    color: homeColors.onSurface,
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
    borderLeftColor: homeColors.accent,
    paddingLeft: 16,
  },
  attribution: {
    fontFamily: homeFonts.sansBold,
    fontSize: 11,
    color: homeColors.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  attributionCentered: {
    textAlign: 'center',
  },
});
