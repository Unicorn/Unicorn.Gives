import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';

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
    borderBottomColor: 'rgba(252, 249, 244, 0.2)',
    backgroundColor: '#2d4a4a',
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
    backgroundColor: 'rgba(0,0,0,0.15)',
    minHeight: 44,
    justifyContent: 'center',
  },
  tabSelected: {
    backgroundColor: '#d4b96e',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c3c8bb',
  },
  tabTextSelected: {
    color: '#1a2e2e',
  },
});
