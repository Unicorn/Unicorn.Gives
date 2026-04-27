import type { ReactNode } from 'react';
import { View, StyleSheet, Platform, type ViewStyle, type StyleProp } from 'react-native';

import { useTheme, radii, shadows } from '@/constants/theme';

type CardVariant = 'flat' | 'elevated';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  hoverable?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'flat', hoverable, style }: CardProps) {
  const { colors } = useTheme();

  const webProps =
    Platform.OS === 'web' && hoverable
      ? { dataSet: { cardHoverable: true } }
      : {};

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.surface },
        variant === 'elevated' ? shadows.cardElevated : shadows.card,
        style,
      ]}
      {...(webProps as any)}
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

// Inject global CSS hover styles on web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const id = '__card-hoverable-css';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      [data-card-hoverable] {
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        cursor: pointer;
      }
      [data-card-hoverable]:hover {
        transform: scale(1.015);
      }
      [data-card-hoverable]:active {
        transform: scale(0.97);
      }
    `;
    document.head.appendChild(s);
  }
}
