import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

interface ServiceItem {
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  price?: string;
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
        <View style={styles.list}>
          {items.map((item, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.price && <Text style={styles.itemPrice}>{item.price}</Text>}
              </View>
              {item.description ? (
                <Text style={styles.itemDesc}>{item.description}</Text>
              ) : null}
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
      paddingVertical: spacing.xxxl + 16,
      backgroundColor: colors.surfaceContainer,
    },
    inner: {
      maxWidth: 1000,
      alignSelf: 'center',
      width: '100%' as any,
    },
    heading: {
      fontFamily: fonts.sansBold,
      fontSize: 32,
      color: colors.neutral,
      marginBottom: spacing.xxl,
    },
    list: {
      gap: 0,
    },
    item: {
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: spacing.md,
    },
    itemTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
      flex: 1,
    },
    itemPrice: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.primary,
    },
    itemDesc: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      lineHeight: 22,
      marginTop: spacing.xs,
    },
  });
