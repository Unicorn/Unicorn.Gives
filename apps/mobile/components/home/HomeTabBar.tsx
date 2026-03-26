import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';

import { homeColors, homeFonts } from '@/constants/homeTheme';

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
  return (
    <View style={styles.wrap}>
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
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{t.label}</Text>
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
    backgroundColor: homeColors.heroBar,
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
  tabSelected: {
    backgroundColor: homeColors.accent,
  },
  tabText: {
    fontSize: 14,
    fontFamily: homeFonts.sansMedium,
    color: 'rgba(255,255,255,0.75)',
  },
  tabTextSelected: {
    color: homeColors.onSurface,
  },
});
