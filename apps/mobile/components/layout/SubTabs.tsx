import { Link, usePathname, type Href } from 'expo-router';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { hrefToPathString } from '@/lib/navigation';
import { useTheme } from '@/constants/theme';

export interface SubTabItem {
  label: string;
  href: Href;
}

interface SubTabsProps {
  tabs: SubTabItem[];
}

export function SubTabs({ tabs }: SubTabsProps) {
  const pathname = usePathname();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.outline }]}>
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
                  isActive && [styles.tabActive, { borderBottomColor: colors.neutral }],
                ])}
              >
                <Text
                  style={StyleSheet.flatten([
                    styles.tabText,
                    { color: colors.neutralVariant },
                    isActive && { color: colors.neutral, fontWeight: '700' },
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
    borderBottomWidth: 1,
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
  tabActive: {},
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
