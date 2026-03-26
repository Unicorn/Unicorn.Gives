import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { homeColors, homeFonts, homeRadii } from '@/constants/homeTheme';

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
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        style={[styles.chip, !selected && styles.chipActive]}
        onPress={() => onSelect(null)}
      >
        <Text style={[styles.chipText, !selected && styles.chipTextActive]}>
          {allLabel}
        </Text>
      </TouchableOpacity>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          style={[styles.chip, selected === cat.key && styles.chipActive]}
          onPress={() => onSelect(selected === cat.key ? null : cat.key)}
        >
          <Text style={[styles.chipText, selected === cat.key && styles.chipTextActive]}>
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 12,
  },
  content: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: homeRadii.pill,
    borderWidth: 1,
    borderColor: homeColors.outline,
    backgroundColor: homeColors.surface,
  },
  chipActive: {
    backgroundColor: homeColors.heroBar,
    borderColor: homeColors.heroBar,
  },
  chipText: {
    fontFamily: homeFonts.sans,
    fontSize: 13,
    color: homeColors.onSurfaceVariant,
  },
  chipTextActive: {
    fontFamily: homeFonts.sansBold,
    color: homeColors.onPrimary,
  },
});
