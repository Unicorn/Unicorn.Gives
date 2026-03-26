import type { Href } from 'expo-router';
import { routes } from '@/lib/navigation';

const DEFAULT_COUNTY_SLUG = 'clare-county';

/** Resolve GOVERN navigation until parent county is loaded from the API for every row. */
export function governmentHref(region: { slug: string; type: string }): Href {
  if (region.type === 'county') return routes.government.county(region.slug);
  // All municipality types (township, city, village) use the same flat path
  return routes.government.municipality(DEFAULT_COUNTY_SLUG, region.slug);
}
