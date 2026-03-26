import { Link, usePathname, type Href } from 'expo-router';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { hrefToPathString } from '@/lib/navigation';

export interface SubTabItem {
  label: string;
  href: Href;
}

interface SubTabsProps {
  tabs: SubTabItem[];
}

export function SubTabs({ tabs }: SubTabsProps) {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const tabPath = hrefToPathString(tab.href);
          const firstPath = tabs[0] ? hrefToPathString(tabs[0].href) : '';
          const isActive =
            pathname === tabPath ||
            (tabPath !== firstPath && pathname.startsWith(tabPath));

          return (
            <Link key={tabPath} href={tab.href} asChild>
              <Pressable
                style={StyleSheet.flatten([
                  styles.tab,
                  isActive && styles.tabActive,
                ])}
              >
                <Text
                  style={StyleSheet.flatten([
                    styles.tabText,
                    isActive && styles.tabTextActive,
                  ])}
                >
                  {tab.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#c3c8bb',
  },
  inner: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#2d4a4a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#73796d',
  },
  tabTextActive: {
    color: '#2d4a4a',
    fontWeight: '700',
  },
});
