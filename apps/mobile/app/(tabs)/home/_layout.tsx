import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { SubTabs, type SubTabItem } from '@/components/layout/SubTabs';
import { toHref } from '@/lib/navigation';

const HOME_TABS: SubTabItem[] = [
  { label: 'Discover', href: toHref('/home') },
  { label: 'Community', href: toHref('/home/community') },
  { label: 'History', href: toHref('/home/history') },
  { label: 'Events', href: toHref('/home/events') },
  { label: 'News', href: toHref('/home/news') },
];

export default function HomeLayout() {
  const pathname = usePathname();
  const knownPaths = HOME_TABS.map((t) => t.href as string);
  const isTopLevel = knownPaths.includes(pathname) || pathname === '/home' || pathname === '/';

  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      {isTopLevel && <SubTabs tabs={HOME_TABS} />}
      <ContentContainer>
        <Stack screenOptions={{ headerShown: false }} />
      </ContentContainer>
    </View>
  );
}
