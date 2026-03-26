import { useLocalSearchParams } from 'expo-router';
import type { MunicipalSegment } from '@/lib/municipalPaths';
import { municipalBasePath } from '@/lib/municipalPaths';

const PARAM: Record<MunicipalSegment, 'townshipSlug' | 'citySlug' | 'villageSlug'> = {
  townships: 'townshipSlug',
  cities: 'citySlug',
  villages: 'villageSlug',
};

export function useMunicipalRoute(segment: MunicipalSegment) {
  const params = useLocalSearchParams<{
    countySlug: string;
    townshipSlug?: string;
    citySlug?: string;
    villageSlug?: string;
  }>();
  const key = PARAM[segment];
  const municipalSlug = params[key] ?? '';
  const countySlug = params.countySlug ?? '';
  const basePath = municipalBasePath(countySlug, segment, municipalSlug);
  return { countySlug, municipalSlug, segment, basePath };
}
