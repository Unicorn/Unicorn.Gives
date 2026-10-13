/**
 * Build-time snapshot of community content (guides, news, events, home,
 * directory) used to seed the first render of the `(tabs)` routes so the static
 * export ships real HTML. See scripts/generate-community-snapshot.ts.
 *
 * Accessors are typed by the caller: each page passes the row type its own
 * query returns, and the generator mirrors that query's columns.
 */
// The JSON is deliberately NOT imported here. Route chunks are split per page on
// web, and a module imported by more than one route lands in the shared chunk
// every visitor downloads. The section's layout (one chunk) imports the data and
// registers it; pages read it through these accessors.

type Row = Record<string, unknown>;
type Snapshot = {
  guides: { list: Row[]; bySlug: Record<string, { guide: Row; contacts: Row[]; forms: Row[] }> };
  news: { list: Row[]; bySlug: Record<string, Row> };
  events: { list: Row[]; bySlug: Record<string, Row> };
  home: { regions: Row[]; news: Row[]; events: Row[]; partners: Row[] };
  directory: { partners: Row[] };
};

let snap: Partial<Snapshot> = {};

/** Called once, at module scope, by app/(tabs)/_layout.tsx. */
export function registerCommunitySnapshot(data: unknown) {
  snap = data as Partial<Snapshot>;
}

export function getStaticGuides<T>(): T[] {
  return (snap.guides?.list ?? []) as T[];
}
export function getStaticGuide<G, C, F>(
  slug: string | undefined,
): { guide: G; contacts: C[]; forms: F[] } | null {
  if (!slug) return null;
  const hit = snap.guides?.bySlug?.[slug];
  return hit ? { guide: hit.guide as G, contacts: hit.contacts as C[], forms: hit.forms as F[] } : null;
}
export function getStaticNewsList<T>(): T[] {
  return (snap.news?.list ?? []) as T[];
}
export function getStaticNewsArticle<T>(slug: string | undefined): T | null {
  return slug ? ((snap.news?.bySlug?.[slug] as T | undefined) ?? null) : null;
}
export function getStaticUpcomingEvents<T>(): T[] {
  return (snap.events?.list ?? []) as T[];
}
export function getStaticEvent<T>(slug: string | undefined): T | null {
  return slug ? ((snap.events?.bySlug?.[slug] as T | undefined) ?? null) : null;
}
export function getStaticHome<R, N, E, P>(): { regions: R[]; news: N[]; events: E[]; partners: P[] } {
  return {
    regions: (snap.home?.regions ?? []) as R[],
    news: (snap.home?.news ?? []) as N[],
    events: (snap.home?.events ?? []) as E[],
    partners: (snap.home?.partners ?? []) as P[],
  };
}
export function getStaticDirectory<T>(): T[] {
  return (snap.directory?.partners ?? []) as T[];
}
