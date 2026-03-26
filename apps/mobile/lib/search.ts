/**
 * Client-side list search: substring match over normalized plain text (markdown-light).
 */

function stripMarkdownForSearch(text: string): string {
  return text
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/[#*_~`>[\]()!|]/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeForSearch(text: string | null | undefined): string {
  if (text == null || text === '') return '';
  return stripMarkdownForSearch(String(text)).toLowerCase();
}

/** True if every whitespace-separated token in `query` appears in the combined searchable text. */
export function matchesSearchQuery(
  query: string,
  searchableParts: (string | null | undefined)[]
): boolean {
  const raw = query.trim().toLowerCase();
  if (!raw) return true;

  const haystack = searchableParts.map(normalizeForSearch).filter(Boolean).join(' ');
  const tokens = raw.split(/\s+/).filter(Boolean);
  return tokens.every((t) => haystack.includes(t));
}
