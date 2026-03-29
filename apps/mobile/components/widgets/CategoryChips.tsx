import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, fonts, fontSize, spacing, radii } from '@/constants/theme';

interface Category {
  key: string;
  label: string;
}

interface CategoryChipsProps {
  categories: Category[];
  selected: string | null;
  onSelect: (key: string | null) => void;
  allLabel?: string;
}

export function CategoryChips({
  categories,
  selected,
  onSelect,
  allLabel = 'All',
}: CategoryChipsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        style={[
          styles.chip,
          { borderColor: colors.outline, backgroundColor: colors.surface },
          !selected && { backgroundColor: colors.heroBar, borderColor: colors.heroBar },
        ]}
        onPress={() => onSelect(null)}
      >
        <Text
          style={[
            styles.chipText,
            { color: colors.neutralVariant },
            !selected && { fontFamily: fonts.sansBold, color: colors.onHeroBar },
          ]}
        >
          {allLabel}
        </Text>
      </TouchableOpacity>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          style={[
            styles.chip,
            { borderColor: colors.outline, backgroundColor: colors.surface },
            selected === cat.key && { backgroundColor: colors.heroBar, borderColor: colors.heroBar },
          ]}
          onPress={() => onSelect(selected === cat.key ? null : cat.key)}
        >
          <Text
            style={[
              styles.chipText,
              { color: colors.neutralVariant },
              selected === cat.key && { fontFamily: fonts.sansBold, color: colors.onHeroBar },
            ]}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: spacing.md,
  },
  content: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm + 1,
  },
});
