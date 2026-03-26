import { useLocalSearchParams } from 'expo-router';
import type { MunicipalSegment } from '@/lib/navigation';
import { hrefToPathString, routes } from '@/lib/navigation';

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
  const basePath = hrefToPathString(
    routes.county.municipal.base(countySlug, segment, municipalSlug)
  );
  return { countySlug, municipalSlug, segment, basePath };
}
