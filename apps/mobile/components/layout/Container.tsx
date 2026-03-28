import { View, StyleSheet, useWindowDimensions, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  /** Apply max-width + centering only, no horizontal padding. Use at layout level. */
  flush?: boolean;
}

/**
 * Max-width centered container. Use inside <Wrapper> or any full-width parent
 * to constrain content width on tablet/desktop.
 */
export function Container({ children, style, flush }: ContainerProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  return (
    <View
      style={[
        styles.base,
        isTablet && (flush ? styles.tabletFlush : styles.tablet),
        isDesktop && (flush ? styles.desktopFlush : styles.desktop),
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
  tabletFlush: {
    maxWidth: 960,
    alignSelf: 'center',
  },
  desktopFlush: {
    maxWidth: 1100,
    alignSelf: 'center',
  },
});
