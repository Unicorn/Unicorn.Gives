/**
 * Grid / List view toggle segmented control.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fonts, fontSize, radii, spacing, useTheme } from '@/constants/theme';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  mode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onToggle }: ViewToggleProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.track, { backgroundColor: colors.surfaceContainerHigh }]}>
      <Pressable
        onPress={() => onToggle('grid')}
        style={[
          styles.segment,
          mode === 'grid' && [styles.segmentActive, { backgroundColor: colors.surface }],
        ]}
      >
        <MaterialIcons
          name="grid-view"
          size={16}
          color={mode === 'grid' ? colors.primary : colors.neutralVariant}
        />
        <Text
          style={[
            styles.label,
            { color: mode === 'grid' ? colors.primary : colors.neutralVariant },
            mode === 'grid' && styles.labelActive,
          ]}
        >
          Grid
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onToggle('list')}
        style={[
          styles.segment,
          mode === 'list' && [styles.segmentActive, { backgroundColor: colors.surface }],
        ]}
      >
        <MaterialIcons
          name="view-list"
          size={16}
          color={mode === 'list' ? colors.primary : colors.neutralVariant}
        />
        <Text
          style={[
            styles.label,
            { color: mode === 'list' ? colors.primary : colors.neutralVariant },
            mode === 'list' && styles.labelActive,
          ]}
        >
          List
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: radii.sm,
    padding: 3,
    alignSelf: 'flex-start',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm - 2,
  },
  segmentActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.sm,
  },
  labelActive: {
    fontFamily: fonts.sansBold,
  },
});
