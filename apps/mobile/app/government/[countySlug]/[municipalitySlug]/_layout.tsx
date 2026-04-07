import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams, usePathname } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { AppBreadcrumbBar } from '@/components/layout/AppHeader';
import { SubTabs, type SubTabItem } from '@/components/layout/SubTabs';
import { useTheme } from '@/constants/theme';
import { routes } from '@/lib/navigation';
import { fetchResourceLanding } from '@/lib/municipal/resourcePages';

export default function MunicipalityLayout() {
  const { colors } = useTheme();
  const { countySlug, municipalitySlug } = useLocalSearchParams<{
    countySlug: string;
    municipalitySlug: string;
  }>();
  const pathname = usePathname();
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

  const basePath = `/government/${countySlug}/${municipalitySlug}`;
  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: countyName, href: `/government/${countySlug}` },
    ];

    // Parse path segments after the municipality base
    const suffix = pathname.replace(basePath, '');
    const segments = suffix.split('/').filter(Boolean);

    if (segments.length === 0) {
      // On overview — municipality is current (no href)
      items.push({ label: regionName, href: '' });
    } else {
      // Municipality becomes a link back to overview
      items.push({ label: regionName, href: basePath });

      // Section label (minutes, resources, etc.)
      const sectionSlug = segments[0];
      const sectionLabel = sectionSlug.charAt(0).toUpperCase() + sectionSlug.slice(1);
      const sectionPath = `${basePath}/${sectionSlug}`;

      if (segments.length === 1) {
        // On a section index — section is current
        items.push({ label: sectionLabel, href: '' });
      } else {
        // On a detail page — section is a link, detail slug is current
        items.push({ label: sectionLabel, href: sectionPath });
        const detailSlug = segments[1];
        const detailLabel = detailSlug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        items.push({ label: detailLabel, href: '' });
      }
    }
    return items;
  }, [pathname, basePath, countyName, regionName]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SubTabs tabs={tabs} />
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
