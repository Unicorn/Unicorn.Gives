import { useLocalSearchParams } from 'expo-router';
import { hrefToPathString, routes } from '@/lib/navigation';

export function useMunicipalRoute() {
  const params = useLocalSearchParams<{
    countySlug: string;
    municipalitySlug: string;
  }>();
  const municipalitySlug = params.municipalitySlug ?? '';
  const countySlug = params.countySlug ?? '';
  const basePath = hrefToPathString(
    routes.government.municipality(countySlug, municipalitySlug)
  );
  return { countySlug, municipalitySlug, basePath };
}
