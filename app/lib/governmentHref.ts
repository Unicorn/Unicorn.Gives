import type { Href } from 'expo-router';
import { routes } from '@/lib/navigation';

const DEFAULT_COUNTY_SLUG = 'clare-county';

/** Resolve GOVERN navigation until parent county is loaded from the API for every row. */
export function governmentHref(region: { slug: string; type: string }): Href {
  if (region.type === 'county') return routes.county.root(region.slug);
  if (region.type === 'township')
    return routes.county.townships.municipalRoot(DEFAULT_COUNTY_SLUG, region.slug);
  if (region.type === 'city')
    return routes.county.cities.municipalRoot(DEFAULT_COUNTY_SLUG, region.slug);
  if (region.type === 'village')
    return routes.county.villages.municipalRoot(DEFAULT_COUNTY_SLUG, region.slug);
  return routes.county.root(DEFAULT_COUNTY_SLUG);
}
