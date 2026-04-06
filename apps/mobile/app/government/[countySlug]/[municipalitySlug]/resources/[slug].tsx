import { useEffect, useState } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { useRegion } from '@/lib/hooks/useRegion';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { routes } from '@/lib/navigation';
import {
  fetchResourcePageBySlug,
  type ResourcePageRow,
} from '@/lib/municipal/resourcePages';
import { ResourcePageContent } from '@/components/municipal/ResourcePageContent';
import { useTheme, spacing } from '@/constants/theme';
import { SeoHead } from '@/components/SeoHead';
import { fetchResourcePagesStaticParams } from '@/lib/static-build-queries';

export async function generateStaticParams() {
  return fetchResourcePagesStaticParams();
}

export default function ResourceDetailScreen() {
  const { colors } = useTheme();
  const { slug: rawSlug } = useLocalSearchParams<{ slug: string | string[] }>();
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const { countySlug, municipalitySlug } = useMunicipalRoute();
  const { region, isLoading: regionLoading } = useRegion(municipalitySlug);
  const [page, setPage] = useState<ResourcePageRow | null | undefined>(undefined);

  useEffect(() => {
    if (!region?.id || !slug) {
      return;
    }
    setPage(undefined);
    fetchResourcePageBySlug(region.id, slug).then((result) => {
      setPage(result);
    });
  }, [region?.id, slug]);

  if (regionLoading || !region || page === undefined) {
    return (
      <View style={{ flex: 1, padding: spacing.xxl, backgroundColor: colors.background }}>
        <Text style={{ color: colors.neutralVariant }}>Loading...</Text>
      </View>
    );
  }

  if (!region || !page) {
    return (
      <Redirect
        href={routes.government.resources.index(countySlug, municipalitySlug)}
      />
    );
  }

  return (
    <>
      <SeoHead
        title={page.title}
        description={page.description ?? undefined}
      />
      <ResourcePageContent
        title={page.title}
        description={page.description}
        body={page.body}
        attachments={page.attachments}
      />
    </>
  );
}
