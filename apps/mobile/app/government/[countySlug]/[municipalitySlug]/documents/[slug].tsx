import { useEffect, useState } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { TownshipDocumentScreen } from '@/components/municipal/TownshipDocumentScreen';
import { useRegion } from '@/lib/hooks/useRegion';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { routes } from '@/lib/navigation';
import {
  fetchMunicipalDocumentBySlug,
  type MunicipalDocumentRow,
} from '@/lib/municipal/municipalDocuments';
import { useTheme, spacing } from '@/constants/theme';

export default function MunicipalDocumentDetailScreen() {
  const { colors } = useTheme();
  const { slug: rawSlug } = useLocalSearchParams<{ slug: string | string[] }>();
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const { countySlug, municipalitySlug } = useMunicipalRoute();
  const { region, isLoading: regionLoading } = useRegion(municipalitySlug);
  const [doc, setDoc] = useState<MunicipalDocumentRow | null | undefined>(undefined);

  useEffect(() => {
    if (!region?.id || !slug) {
      setDoc(null);
      return;
    }
    fetchMunicipalDocumentBySlug(region.id, slug).then(setDoc);
  }, [region?.id, slug]);

  if (regionLoading || doc === undefined) {
    return (
      <View style={{ flex: 1, padding: spacing.xxl, backgroundColor: colors.background }}>
        <Text style={{ color: colors.neutralVariant }}>Loading...</Text>
      </View>
    );
  }

  if (!region || !doc) {
    return <Redirect href={routes.government.municipality(countySlug, municipalitySlug)} />;
  }

  return (
    <TownshipDocumentScreen
      title={doc.title}
      subtitle={doc.subtitle}
      adoptedDate={doc.adopted_date}
      adoptedBy={doc.adopted_by}
      description={doc.description}
      pdfPath={doc.pdf_url}
      pdfSizeMB={doc.pdf_size_label}
      meta={doc.meta}
      sections={doc.sections}
      tableOfContents={doc.table_of_contents ?? undefined}
    />
  );
}
