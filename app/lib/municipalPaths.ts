export type MunicipalSegment = 'townships' | 'cities' | 'villages';

export function municipalBasePath(
  countySlug: string,
  segment: MunicipalSegment,
  municipalSlug: string
) {
  return `/county/${countySlug}/${segment}/${municipalSlug}`;
}

