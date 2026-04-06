import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams, usePathname } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { AppBreadcrumbBar } from '@/components/layout/AppHeader';
import { SubTabs, type SubTabItem } from '@/components/layout/SubTabs';
import { useTheme } from '@/constants/theme';
import { routes, isMunicipalDetailPath } from '@/lib/navigation';
import { fetchResourceLanding } from '@/lib/municipal/resourcePages';

export default function MunicipalityLayout() {
  const { colors } = useTheme();
  const { countySlug, municipalitySlug } = useLocalSearchParams<{
    countySlug: string;
    municipalitySlug: string;
  }>();
  const pathname = usePathname();
  const isDetailPage = isMunicipalDetailPath(pathname);
  const { region } = useRegion(municipalitySlug);
  const { region: county } = useRegion(countySlug);

  const regionName = region?.name ?? 'Municipality';
  const countyName = county?.name ?? countySlug.replace(/-/g, ' ');
  const baseTabs = useMemo(
    () => routes.government.municipalSubNavTabs(countySlug, municipalitySlug),
    [countySlug, municipalitySlug]
  );
  const [resourcesTab, setResourcesTab] = useState<SubTabItem | null>(null);

  useEffect(() => {
    if (!region?.id) {
      setResourcesTab(null);
      return;
    }
    let cancelled = false;
    fetchResourceLanding(region.id).then((landing) => {
      if (cancelled) return;
      if (landing) {
        setResourcesTab({
          label: 'Resources',
          href: routes.government.resources.index(countySlug, municipalitySlug),
        });
      } else {
        setResourcesTab(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [region?.id, countySlug, municipalitySlug]);

  const tabs = useMemo(
    () => (resourcesTab ? [...baseTabs, resourcesTab] : baseTabs),
    [baseTabs, resourcesTab]
  );

  const breadcrumbItems = [
    { label: countyName, href: `/government/${countySlug}` },
    { label: regionName, href: '' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {!isDetailPage && <SubTabs tabs={tabs} />}
      <AppBreadcrumbBar items={breadcrumbItems} />
      <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="minutes/index" />
        <Stack.Screen name="minutes/[slug]" />
        <Stack.Screen name="ordinances/index" />
        <Stack.Screen name="ordinances/[slug]" />
        <Stack.Screen name="contacts/index" />
        <Stack.Screen name="contacts/[slug]" />
        <Stack.Screen name="events/index" />
        <Stack.Screen name="events/[slug]" />
        <Stack.Screen name="elections/index" />
        <Stack.Screen name="elections/[slug]" />
        <Stack.Screen name="documents/index" />
        <Stack.Screen name="documents/[slug]" />
        <Stack.Screen name="resources/index" />
        <Stack.Screen name="resources/[slug]" />
        <Stack.Screen name="zoning" />
        <Stack.Screen name="master-plan" />
        <Stack.Screen name="recreation-plan" />
      </Stack>
      </View>
    </View>
  );
}
