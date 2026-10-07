/**
 * Section heading for partner landing pages.
 *
 * The theme pairs Newsreader with Manrope and defines serif `display`/`headline`
 * presets, but the partner sections had each hardcoded the same 32px Manrope
 * bold — four identical headings and none of the brand's actual voice. This
 * puts the serif setting in one place so the sections share a rhythm.
 */
import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  useTheme,
  fonts,
  fontSize,
  spacing,
  letterSpacing,
  breakpoints,
  type ThemeColors,
} from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';

interface SectionHeadingProps {
  title: string;
  /** One supporting line. Kept short — it sits directly under the title. */
  lede?: string | null;
}

export function SectionHeading({ title, lede }: SectionHeadingProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const compact = width > 0 && width < breakpoints.tablet;
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
      {lede ? <Text style={styles.lede}>{lede}</Text> : null}
      <View style={styles.rule} />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      marginBottom: spacing.xl,
    },
    title: {
      fontFamily: fonts.serifBold,
      fontSize: 38,
      lineHeight: 44,
      letterSpacing: letterSpacing.display,
      color: colors.neutral,
    },
    titleCompact: {
      fontSize: 30,
      lineHeight: 36,
    },
    lede: {
      fontFamily: fonts.sans,
      fontSize: fontSize.lg,
      lineHeight: 24,
      color: colors.neutralVariant,
      marginTop: spacing.sm,
      // Keeps the supporting line inside a comfortable measure.
      maxWidth: 560,
    },
    rule: {
      height: 1,
      backgroundColor: colors.outlineVariant,
      marginTop: spacing.lg,
    },
  });
