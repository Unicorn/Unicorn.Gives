/**
 * Responsive grid layout for event cards.
 * 1 column on mobile, 2 on tablet, 3 on desktop.
 */
import { Children, type ReactNode, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { breakpoints, spacing } from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';

const GAP = spacing.xl;

interface EventsGridProps {
  children: ReactNode;
}

export function EventsGrid({ children }: EventsGridProps) {
  const { width: viewportWidth } = useHydratedDimensions();
  const [containerWidth, setContainerWidth] = useState(0);

  const cols =
    viewportWidth >= breakpoints.desktop ? 3 : viewportWidth >= breakpoints.tablet ? 2 : 1;

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  if (cols === 1) {
    return (
      <View style={styles.grid} onLayout={onLayout}>
        {children}
      </View>
    );
  }

  // Calculate cell width: subtract total gap space, divide by column count
  const totalGap = GAP * (cols - 1);
  const cellWidth = containerWidth > 0
    ? Math.floor((containerWidth - totalGap) / cols)
    : undefined;

  return (
    <View style={styles.gridWrap} onLayout={onLayout}>
      {Children.map(children, (child, i) => (
        <View
          key={(child as any)?.key ?? i}
          style={cellWidth ? { width: cellWidth } : styles.fallbackCell}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: GAP,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    gap: GAP,
  },
  fallbackCell: {
    flex: 1,
    minWidth: 260,
  },
});
