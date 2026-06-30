/**
 * Bingo engine — framework-agnostic (no React imports) so it can be unit-tested
 * and shared between the admin "preview board" tool and the player UI.
 *
 * NOTE: the authoritative board composition runs server-side in the
 * `bingo-issue-board` edge function, which keeps its own Deno copy of
 * `buildBoard` at `supabase/functions/_shared/bingoEngine.ts`. Keep the two
 * `buildBoard` implementations in sync — they implement the same spec.
 */

// --- Types --------------------------------------------------------------------

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

export type WinPattern =
  | 'row'
  | 'column'
  | 'diagonal'
  | 'bingo'
  | 'corners'
  | 'plus'
  | 'x'
  | 'blackout';

export interface WinTier {
  key: string;
  label: string;
  pattern: WinPattern;
  prize?: string;
  rank: number;
}

export interface BoardConfig {
  boardSize: number;
  hardCap: number;
  freeSpaceLabel: string;
  categories: BingoCategory[];
}

export interface BoardCell {
  squareId: string | null; // null for the FREE center
  text: string;
  category: string | null;
  difficulty: Difficulty | null;
  free: boolean;
}

export interface WinResult {
  satisfied: WinTier[];
  highestTier: WinTier | null;
  lines: number[][]; // index groups that are fully covered
}

// --- Seeded RNG (mulberry32) --------------------------------------------------

/** Hash an arbitrary string seed into a 32-bit unsigned integer. */
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

/** Small deterministic PRNG. Same seed → same sequence. */
export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle using a seeded RNG. Returns a new array. */
function shuffle<T>(items: T[], rng: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// --- Board generation ---------------------------------------------------------

/**
 * Build a board from a square pool. Guarantees category minimums and caps the
 * number of hard (difficulty-3) squares, then shuffles into positions with the
 * FREE space at the center. Pure + deterministic for a given seed.
 */
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

  // 1–2. Per-category minimums from a per-category shuffled list.
  for (const cat of categories) {
    if (!cat.min || cat.min <= 0) continue;
    const group = shuffle(
      pool.filter((s) => s.category === cat.key),
      rng,
    );
    let taken = 0;
    for (const sq of group) {
      if (taken >= cat.min || selected.length >= taskCount) break;
      if (!canTake(sq)) continue;
      take(sq);
      taken++;
    }
  }

  // 3. Fill the rest from a globally shuffled pool, still honoring the cap.
  const globalPool = shuffle(pool, rng);
  for (const sq of globalPool) {
    if (selected.length >= taskCount) break;
    if (!canTake(sq)) continue;
    take(sq);
  }

  // 4. Shuffle tasks into positions and insert FREE at the center.
  const shuffledTasks = shuffle(selected, rng);
  const cells: BoardCell[] = [];
  let taskIdx = 0;
  for (let i = 0; i < total; i++) {
    if (i === centerIndex) {
      cells.push({
        squareId: null,
        text: freeSpaceLabel,
        category: null,
        difficulty: null,
        free: true,
      });
      continue;
    }
    const sq = shuffledTasks[taskIdx++];
    if (sq) {
      cells.push({
        squareId: sq.id,
        text: sq.text,
        category: sq.category,
        difficulty: sq.difficulty,
        free: false,
      });
    } else {
      // Pool too small to fill the board — leave an empty placeholder.
      cells.push({ squareId: null, text: '', category: null, difficulty: null, free: false });
    }
  }

  return cells;
}

// --- Win detection ------------------------------------------------------------

/** All complete lines (rows, columns, both diagonals) for a board size. */
function allLines(n: number): number[][] {
  const lines: number[][] = [];
  for (let r = 0; r < n; r++) lines.push(Array.from({ length: n }, (_, c) => r * n + c));
  for (let c = 0; c < n; c++) lines.push(Array.from({ length: n }, (_, r) => r * n + c));
  lines.push(Array.from({ length: n }, (_, i) => i * n + i)); // main diagonal
  lines.push(Array.from({ length: n }, (_, i) => i * n + (n - 1 - i))); // anti-diagonal
  return lines;
}

function rowIndices(n: number, r: number): number[] {
  return Array.from({ length: n }, (_, c) => r * n + c);
}
function colIndices(n: number, c: number): number[] {
  return Array.from({ length: n }, (_, r) => r * n + c);
}
function mainDiagonal(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i * n + i);
}
function antiDiagonal(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i * n + (n - 1 - i));
}

/** Index groups that satisfy a given pattern. */
function patternLines(pattern: WinPattern, n: number): number[][] {
  const center = Math.floor(n / 2);
  switch (pattern) {
    case 'row':
      return Array.from({ length: n }, (_, r) => rowIndices(n, r));
    case 'column':
      return Array.from({ length: n }, (_, c) => colIndices(n, c));
    case 'diagonal':
      return [mainDiagonal(n), antiDiagonal(n)];
    case 'bingo':
      return allLines(n);
    case 'corners':
      return [[0, n - 1, n * (n - 1), n * n - 1]];
    case 'plus':
      return [[...new Set([...rowIndices(n, center), ...colIndices(n, center)])]];
    case 'x':
      return [[...new Set([...mainDiagonal(n), ...antiDiagonal(n)])]];
    case 'blackout':
      return [Array.from({ length: n * n }, (_, i) => i)];
    default:
      return [];
  }
}

/**
 * Detect wins. The center FREE space always counts as marked. Returns the
 * complete lines covered, the tiers satisfied, and the single highest tier (by
 * rank) so prizes can be driven off the tier.
 */
export function detectWins(
  marked: boolean[],
  tiers: WinTier[],
  boardSize: number,
): WinResult {
  const n = boardSize;
  const total = n * n;
  const center = Math.floor(total / 2);

  const isMarked = (i: number): boolean => i === center || !!marked[i];
  const lineCovered = (indices: number[]): boolean => indices.every(isMarked);

  const lines = allLines(n).filter(lineCovered);

  const satisfied: WinTier[] = [];
  for (const tier of tiers) {
    const groups = patternLines(tier.pattern, n);
    const hit = groups.some(lineCovered);
    if (hit) satisfied.push(tier);
  }

  const highestTier =
    satisfied.length === 0
      ? null
      : satisfied.reduce((best, t) => (t.rank > best.rank ? t : best), satisfied[0]);

  return { satisfied, highestTier, lines };
}

// --- Board codes --------------------------------------------------------------

const BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford (no I, L, O, U)

/** Encode a numeric hash into a short, human-friendly code like "LG-7K2QX". */
export function encodeCode(value: number, length = 5): string {
  let v = value >>> 0;
  let out = '';
  for (let i = 0; i < length; i++) {
    out = BASE32[v % 32] + out;
    v = Math.floor(v / 32);
  }
  return out;
}

/** Build a shareable board code, e.g. formatBoardCode('LG', seed) → "LG-7K2QX". */
export function formatBoardCode(prefix: string, seed: string): string {
  return `${prefix.toUpperCase()}-${encodeCode(hashSeed(seed))}`;
}
