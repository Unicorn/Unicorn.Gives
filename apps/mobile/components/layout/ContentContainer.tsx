import { View, StyleSheet, useWindowDimensions, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function ContentContainer({ children, style }: ContentContainerProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  return (
    <View
      style={[
        styles.base,
        isTablet && styles.tablet,
        isDesktop && styles.desktop,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
  tablet: {
    maxWidth: 960,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  desktop: {
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 28,
  },
});
