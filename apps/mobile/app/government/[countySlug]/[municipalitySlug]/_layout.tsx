import { View } from 'react-native';
import { Stack, useLocalSearchParams, usePathname } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { AppHeader } from '@/components/layout/AppHeader';
import { SubTabs } from '@/components/layout/SubTabs';
import { routes, isMunicipalDetailPath } from '@/lib/navigation';

export default function MunicipalityLayout() {
  const { countySlug, municipalitySlug } = useLocalSearchParams<{
    countySlug: string;
    municipalitySlug: string;
  }>();
  const pathname = usePathname();
  const { region } = useRegion(municipalitySlug);

  const regionName = region?.name ?? 'Municipality';
  const tabs = routes.government.municipalSubNavTabs(countySlug, municipalitySlug);
  const isDetailPage = isMunicipalDetailPath(pathname);

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
        <Stack.Screen name="zoning" />
      </Stack>
    </View>
  );
}
