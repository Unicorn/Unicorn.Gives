import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  image_url?: string;
}

interface TestimonialsSectionProps {
  items: TestimonialItem[];
}

export function TestimonialsSection({ items }: TestimonialsSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>What People Say</Text>
        <View style={styles.grid}>
          {items.map((item, i) => (
            <View key={i} style={styles.card}>
              <MaterialIcons name="format-quote" size={24} color={colors.primary} />
              <Text style={styles.quote}>{item.quote}</Text>
              <View style={styles.attribution}>
                <Text style={styles.author}>{item.author}</Text>
                {item.role && <Text style={styles.role}>{item.role}</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
      backgroundColor: colors.surfaceContainer,
    },
    inner: {
      maxWidth: 900,
      alignSelf: 'center',
      width: '100%' as any,
    },
    heading: {
      fontFamily: fonts.sansBold,
      fontSize: 28,
      color: colors.neutral,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.lg,
      justifyContent: 'center',
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      padding: spacing.xl,
      width: 340,
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    quote: {
      fontFamily: fonts.serifItalic,
      fontSize: fontSize.lg,
      color: colors.neutral,
      lineHeight: 28,
    },
    attribution: {
      marginTop: spacing.sm,
    },
    author: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.sm + 1,
      color: colors.neutral,
    },
    role: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
    },
  });
