export type LoreSection = {
  heading: string;
  body: string;
  lore_callout?: string;
};

export type LoreDocument = {
  title: string;
  eyebrow: string;
  intro: string;
  sections: LoreSection[];
  seo_description: string;
};

const LORE_BY_SLUG: Record<string, LoreDocument> = {
  dogman: require('@/data/lore/dogman.json'),
  memegwesiwak: require('@/data/lore/memegwesiwak.json'),
  mishibizhiw: require('@/data/lore/mishibizhiw.json'),
  anishinaabe: require('@/data/lore/anishinaabe.json'),
};

export const LORE_ORDER = ['dogman', 'memegwesiwak', 'mishibizhiw', 'anishinaabe'] as const;

export type LoreSlug = (typeof LORE_ORDER)[number];

export function getLoreDoc(slug: string): LoreDocument | null {
  return LORE_BY_SLUG[slug] ?? null;
}

export function isLoreSlug(slug: string): slug is LoreSlug {
  return (LORE_ORDER as readonly string[]).includes(slug);
}
