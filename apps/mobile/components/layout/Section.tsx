import { View, StyleSheet, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { spacing } from '@/constants/theme';

interface SectionProps {
  children: ReactNode;
  style?: ViewStyle;
  /** Remove default horizontal padding */
  flush?: boolean;
}

export function Section({ children, style, flush }: SectionProps) {
  return (
    <View style={[styles.section, flush && styles.flush, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  flush: {
    paddingHorizontal: 0,
  },
});
