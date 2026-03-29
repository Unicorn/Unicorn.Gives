import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

export function EventCardList({ children }: { children: ReactNode }) {
  return <View style={styles.list}>{children}</View>;
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
});
