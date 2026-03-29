import { Redirect, useLocalSearchParams } from 'expo-router';
import { routes } from '@/lib/navigation';

export default function LegacyMunicipalDocumentRedirect() {
  const { countySlug, municipalitySlug } = useLocalSearchParams<{
    countySlug: string;
    municipalitySlug: string;
  }>();
  return (
    <Redirect
      href={routes.government.documents.detail(
        countySlug ?? '',
        municipalitySlug ?? '',
        'recreation-plan-2026-2030'
      )}
    />
  );
}
