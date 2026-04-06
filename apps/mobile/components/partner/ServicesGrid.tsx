import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

interface ServiceItem {
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
}

interface ServicesGridProps {
  items: ServiceItem[];
}

export function ServicesGrid({ items }: ServicesGridProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Services</Text>
        <View style={styles.grid}>
          {items.map((item, i) => (
            <View key={i} style={styles.card}>
              {item.icon && (
                <MaterialIcons
                  name={item.icon as keyof typeof MaterialIcons.glyphMap}
                  size={28}
                  color={colors.primary}
                />
              )}
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.description && (
                <Text style={styles.cardDesc}>{item.description}</Text>
              )}
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
      width: 260,
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    cardTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
    },
    cardDesc: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      lineHeight: 22,
    },
  });
