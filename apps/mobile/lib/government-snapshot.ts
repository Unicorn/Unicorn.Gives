/**
 * Build-time snapshot of municipal content, used to seed the first render of
 * `/government` routes. See scripts/generate-government-snapshot.ts, which also
 * documents what is deliberately left out (minutes bodies, upcoming events).
 */
// The JSON is deliberately NOT imported here. Route chunks are split per page on
// web, and a module imported by more than one route lands in the shared chunk
// every visitor downloads. The section's layout (one chunk) imports the data and
// registers it; pages read it through these accessors.

type RegionBundle = {
  landing: unknown | null;
  stats: { minutes: number; ordinances: number; contacts: number; events: number };
  resourcePages: unknown[];
  minutesList: unknown[];
  ordinancesList: unknown[];
  ordinancesBySlug: Record<string, unknown>;
  contacts: unknown[];
};

type GovernmentSnapshot = {
  regionsBySlug: Record<string, unknown>;
  byRegionId: Record<string, RegionBundle>;
};

let snapshot: GovernmentSnapshot = { regionsBySlug: {}, byRegionId: {} };

/** Called once, at module scope, by app/government/_layout.tsx. */
export function registerGovernmentSnapshot(data: unknown) {
  snapshot = data as GovernmentSnapshot;
}

export function getStaticRegion<T>(slug: string | undefined): T | null {
  if (!slug) return null;
  return ((snapshot.regionsBySlug ?? {})[slug] as T) ?? null;
}

function bundle(regionId: string | undefined): RegionBundle | null {
  if (!regionId) return null;
  return (snapshot.byRegionId ?? {})[regionId] ?? null;
}

/** True when this region has a snapshot, i.e. its landing state is known. */
export function hasStaticRegionBundle(regionId: string | undefined): boolean {
  return bundle(regionId) !== null;
}

export function getStaticRegionLanding<T>(regionId: string | undefined): T | null {
  return (bundle(regionId)?.landing as T) ?? null;
}

export function getStaticRegionStats(regionId: string | undefined) {
  return bundle(regionId)?.stats ?? { minutes: 0, ordinances: 0, contacts: 0, events: 0 };
}

export function getStaticResourcePages<T>(regionId: string | undefined): T[] {
  return (bundle(regionId)?.resourcePages ?? []) as T[];
}

export function getStaticMinutesList<T>(regionId: string | undefined): T[] {
  return (bundle(regionId)?.minutesList ?? []) as T[];
}

export function getStaticOrdinancesList<T>(regionId: string | undefined): T[] {
  return (bundle(regionId)?.ordinancesList ?? []) as T[];
}

export function getStaticOrdinance<T>(
  regionId: string | undefined,
  slug: string | undefined,
): T | null {
  if (!slug) return null;
  return ((bundle(regionId)?.ordinancesBySlug ?? {})[slug] as T) ?? null;
}

export function getStaticContacts<T>(regionId: string | undefined): T[] {
  return (bundle(regionId)?.contacts ?? []) as T[];
}
