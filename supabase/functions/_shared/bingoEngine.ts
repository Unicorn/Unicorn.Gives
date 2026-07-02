/**
 * Bingo board generator — Deno copy for the `bingo-issue-board` edge function.
 *
 * This is the authoritative, server-side board builder. It MUST stay in sync
 * with the app engine at `apps/mobile/lib/bingo/engine.ts` (`buildBoard` and the
 * seed/code helpers implement the same spec). The app keeps its own copy for the
 * admin "preview board" tool; this one issues real, crypto-seeded boards.
 */

export type Difficulty = 1 | 2 | 3;

export interface BingoSquare {
  id: string;
  text: string;
  category: string;
  difficulty: Difficulty;
}

export interface BingoCategory {
  key: string;
  label: string;
  color?: string;
  min: number;
}

export interface BoardConfig {
  boardSize: number;
  hardCap: number;
  freeSpaceLabel: string;
  categories: BingoCategory[];
}

export interface BoardCell {
  squareId: string | null;
  text: string;
  category: string | null;
  difficulty: Difficulty | null;
  free: boolean;
}

export function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildBoard(
  config: BoardConfig,
  pool: BingoSquare[],
  seed: string,
): BoardCell[] {
  const { boardSize, hardCap, freeSpaceLabel, categories } = config;
  const total = boardSize * boardSize;
  const centerIndex = Math.floor(total / 2);
  const taskCount = total - 1;

  const rng = mulberry32(hashSeed(seed));

  const selected: BingoSquare[] = [];
  const usedIds = new Set<string>();
  let hardUsed = 0;

  const canTake = (sq: BingoSquare): boolean =>
    !usedIds.has(sq.id) && (sq.difficulty !== 3 || hardUsed < hardCap);
  const take = (sq: BingoSquare): void => {
    selected.push(sq);
    usedIds.add(sq.id);
    if (sq.difficulty === 3) hardUsed++;
  };

  for (const cat of categories) {
    if (!cat.min || cat.min <= 0) continue;
    const group = shuffle(pool.filter((s) => s.category === cat.key), rng);
    let taken = 0;
    for (const sq of group) {
      if (taken >= cat.min || selected.length >= taskCount) break;
      if (!canTake(sq)) continue;
      take(sq);
      taken++;
    }
  }

  const globalPool = shuffle(pool, rng);
  for (const sq of globalPool) {
    if (selected.length >= taskCount) break;
    if (!canTake(sq)) continue;
    take(sq);
  }

  const shuffledTasks = shuffle(selected, rng);
  const cells: BoardCell[] = [];
  let taskIdx = 0;
  for (let i = 0; i < total; i++) {
    if (i === centerIndex) {
      cells.push({ squareId: null, text: freeSpaceLabel, category: null, difficulty: null, free: true });
      continue;
    }
    const sq = shuffledTasks[taskIdx++];
    cells.push(
      sq
        ? { squareId: sq.id, text: sq.text, category: sq.category, difficulty: sq.difficulty, free: false }
        : { squareId: null, text: '', category: null, difficulty: null, free: false },
    );
  }
  return cells;
}

const BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function encodeCode(value: number, length = 5): string {
  let v = value >>> 0;
  let out = '';
  for (let i = 0; i < length; i++) {
    out = BASE32[v % 32] + out;
    v = Math.floor(v / 32);
  }
  return out;
}

export function formatBoardCode(prefix: string, seed: string): string {
  return `${prefix.toUpperCase()}-${encodeCode(hashSeed(seed))}`;
}

/** Derive a short code prefix from a game slug, e.g. "lake-george-…" → "LG". */
export function prefixFromSlug(slug: string): string {
  const initials = slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (initials.slice(0, 3) || 'BG');
}
