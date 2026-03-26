import { View } from 'react-native';
import { Stack, useLocalSearchParams, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { SubTabs } from '@/components/layout/SubTabs';
import { useRegion } from '@/lib/hooks/useRegion';
import { isRegionStackDetailPath, routes } from '@/lib/navigation';

export default function RegionLayout() {
  const { regionSlug } = useLocalSearchParams<{ regionSlug: string }>();
  const { region } = useRegion(regionSlug);
  const pathname = usePathname();

  const regionName = region?.name || 'Region';

  const tabs = routes.region.subNavTabs(regionSlug);

  // Show SubTabs on index/list pages, not on detail pages (e.g. /minutes/some-slug)
  const isDetailPage = isRegionStackDetailPath(pathname);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title={regionName} showBack={isDetailPage} />
      {!isDetailPage && <SubTabs tabs={tabs} />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="minutes/index" />
        <Stack.Screen name="minutes/[slug]" />
        <Stack.Screen name="ordinances/index" />
        <Stack.Screen name="ordinances/[slug]" />
        <Stack.Screen name="contacts/index" />
        <Stack.Screen name="contacts/[slug]" />
        <Stack.Screen name="elections/index" />
        <Stack.Screen name="elections/[slug]" />
      </Stack>
    </View>
  );
}
