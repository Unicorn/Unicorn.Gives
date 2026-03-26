import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { useTheme, fonts } from '@/constants/theme';

export type HomeTabId = 'discover' | 'stay' | 'history' | 'events' | 'news';

const TABS: { id: HomeTabId; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'stay', label: 'Stay' },
  { id: 'history', label: 'History' },
  { id: 'events', label: 'Events' },
  { id: 'news', label: 'News' },
];

type Props = {
  active: HomeTabId;
  onChange: (id: HomeTabId) => void;
};

export function HomeTabBar({ active, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.heroBar }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        accessibilityRole="tablist"
      >
        {TABS.map((t) => {
          const selected = active === t.id;
          return (
            <Pressable
              key={t.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => onChange(t.id)}
              style={[styles.tab, selected && { backgroundColor: colors.heroBar }]}
            >
              <Text
                style={[
                  styles.tabText,
                  selected && { color: colors.onHeroBar },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    minHeight: 44,
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: 'rgba(255,255,255,0.75)',
  },
});
