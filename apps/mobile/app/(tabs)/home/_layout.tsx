import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { SubTabs, type SubTabItem } from '@/components/layout/SubTabs';
import { toHref } from '@/lib/navigation';
import { useTheme } from '@/constants/theme';

const HOME_TABS: SubTabItem[] = [
  { label: 'Discover', href: toHref('/home') },
  { label: 'Community', href: toHref('/home/community') },
  { label: 'History', href: toHref('/home/history') },
  { label: 'Events', href: toHref('/home/events') },
  { label: 'News', href: toHref('/home/news') },
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
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
