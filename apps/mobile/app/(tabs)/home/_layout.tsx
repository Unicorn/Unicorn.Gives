import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { SubTabs, type SubTabItem } from '@/components/layout/SubTabs';
import { toHref, paths } from '@/lib/navigation';
import { useTheme } from '@/constants/theme';

const HOME_TABS: SubTabItem[] = [
  { label: 'Discover', href: toHref(paths.homeDiscover) },
  { label: 'Community', href: toHref(paths.community.index) },
  { label: 'History', href: toHref(paths.history.index) },
  { label: 'Events', href: toHref(paths.community.events) },
  { label: 'News', href: toHref(paths.community.news) },
];

export default function HomeLayout() {
  const pathname = usePathname();
  const { colors } = useTheme();
  const knownPaths = HOME_TABS.map((t) => t.href as string);
  const isTopLevel = knownPaths.includes(pathname) || pathname === '/home' || pathname === '/';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader />
      {isTopLevel && <SubTabs tabs={HOME_TABS} />}
      <ContentContainer flush style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </ContentContainer>
    </View>
  );
}
