import { View } from 'react-native';
import { Stack, useLocalSearchParams, usePathname } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { AppHeader } from '@/components/layout/AppHeader';
import { SubTabs } from '@/components/layout/SubTabs';
import type { MunicipalSegment } from '@/lib/municipalPaths';
import { municipalBasePath } from '@/lib/municipalPaths';
import { regionSubsegments, toHref } from '@/lib/navigation';

type SlugParam = 'townshipSlug' | 'citySlug' | 'villageSlug';

const SEGMENT_TO_PARAM: Record<MunicipalSegment, SlugParam> = {
  townships: 'townshipSlug',
  cities: 'citySlug',
  villages: 'villageSlug',
};

export function MunicipalAreaLayout({ segment }: { segment: MunicipalSegment }) {
  const params = useLocalSearchParams<{
    countySlug: string;
    townshipSlug?: string;
    citySlug?: string;
    villageSlug?: string;
  }>();
  const pathname = usePathname();
  const paramKey = SEGMENT_TO_PARAM[segment];
  const municipalSlug = params[paramKey] ?? '';
  const { countySlug } = params;
  const { region } = useRegion(municipalSlug);

  const regionName = region?.name ?? 'Municipality';
  const basePath = municipalBasePath(countySlug, segment, municipalSlug);

  const tabs = [
    { label: 'Overview', href: toHref(basePath) },
    { label: 'Minutes', href: toHref(`${basePath}/${regionSubsegments.minutes}`) },
    { label: 'Ordinances', href: toHref(`${basePath}/${regionSubsegments.ordinances}`) },
    { label: 'Contacts', href: toHref(`${basePath}/${regionSubsegments.contacts}`) },
    { label: 'Elections', href: toHref(`${basePath}/${regionSubsegments.elections}`) },
    { label: 'Permits', href: toHref(`${basePath}/permits`) },
    { label: 'Zoning', href: toHref(`${basePath}/zoning`) },
  ];

  const isDetailPage = /\/(?:minutes|ordinances|contacts|elections)\/[^/]+$/.test(pathname);

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
        <Stack.Screen name="permits" />
        <Stack.Screen name="zoning" />
        <Stack.Screen name="assessor" />
        <Stack.Screen name="fire" />
        <Stack.Screen name="communities/[communitySlug]/index" />
        <Stack.Screen name="sad" />
      </Stack>
    </View>
  );
}
