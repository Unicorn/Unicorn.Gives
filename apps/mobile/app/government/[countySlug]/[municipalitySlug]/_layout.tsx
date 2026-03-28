import { View } from 'react-native';
import { Stack, useLocalSearchParams, usePathname } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { SubTabs } from '@/components/layout/SubTabs';
import { routes, isMunicipalDetailPath } from '@/lib/navigation';

export default function MunicipalityLayout() {
  const { countySlug, municipalitySlug } = useLocalSearchParams<{
    countySlug: string;
    municipalitySlug: string;
  }>();
  const pathname = usePathname();
  const { region } = useRegion(municipalitySlug);
  const { region: county } = useRegion(countySlug);

  const regionName = region?.name ?? 'Municipality';
  const countyName = county?.name ?? countySlug.replace(/-/g, ' ');
  const tabs = routes.government.municipalSubNavTabs(countySlug, municipalitySlug);
  const isDetailPage = isMunicipalDetailPath(pathname);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        showBack={isDetailPage}
        breadcrumb={[
          { label: countyName, href: `/government/${countySlug}` },
          { label: regionName, href: '' },
        ]}
      />
      {!isDetailPage && <SubTabs tabs={tabs} />}
      <ContentContainer style={{ flex: 1 }}>
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
        <Stack.Screen name="zoning" />
        <Stack.Screen name="master-plan" />
        <Stack.Screen name="recreation-plan" />
      </Stack>
      </ContentContainer>
    </View>
  );
}
