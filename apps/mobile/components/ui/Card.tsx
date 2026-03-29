import type { ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';

import { useTheme, radii, shadows } from '@/constants/theme';

type CardVariant = 'flat' | 'elevated';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'flat', style }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.surface },
        variant === 'elevated' ? shadows.cardElevated : shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
});
