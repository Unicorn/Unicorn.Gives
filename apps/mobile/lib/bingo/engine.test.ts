import { describe, it, expect } from 'vitest';
import {
  buildBoard,
  detectWins,
  formatBoardCode,
  hashSeed,
  type BingoSquare,
  type BoardConfig,
  type WinTier,
} from './engine';

// Mirror of the Lake George category minimums for the test pool.
const CATEGORIES = [
  { key: 'biz', label: 'Local Business', min: 3 },
  { key: 'civic', label: 'Good Deeds', min: 2 },
  { key: 'nature', label: 'Wild / Nature', min: 3 },
  { key: 'adv', label: 'Adventure', min: 1 },
  { key: 'social', label: 'Social / Silly', min: 1 },
  { key: 'raunch', label: '18+ / Raunch', min: 3 },
];

const CONFIG: BoardConfig = {
  boardSize: 5,
  hardCap: 6,
  freeSpaceLabel: 'FREE',
  categories: CATEGORIES,
};

// Build a pool with enough squares per category and a spread of difficulties.
function makePool(): BingoSquare[] {
  const pool: BingoSquare[] = [];
  const perCat = 11;
  for (const cat of CATEGORIES) {
    for (let i = 0; i < perCat; i++) {
      pool.push({
        id: `${cat.key}-${i}`,
        text: `${cat.label} task ${i}`,
        // Roughly a third hard so the cap is exercised.
        difficulty: ((i % 3) + 1) as 1 | 2 | 3,
        category: cat.key,
      });
    }
  }
  return pool;
}

const TIERS: WinTier[] = [
  { key: 'corners', label: 'Four Corners', pattern: 'corners', rank: 1 },
  { key: 'bingo', label: 'Bingo', pattern: 'bingo', rank: 2 },
  { key: 'plus', label: 'The Plus', pattern: 'plus', rank: 3 },
  { key: 'x', label: 'The X', pattern: 'x', rank: 4 },
  { key: 'blackout', label: 'Blackout', pattern: 'blackout', rank: 5 },
];

describe('buildBoard', () => {
  const pool = makePool();

  it('is deterministic — same seed yields the same board', () => {
    const a = buildBoard(CONFIG, pool, 'seed-123');
    const b = buildBoard(CONFIG, pool, 'seed-123');
    expect(a).toEqual(b);
  });

  it('produces different boards for different seeds', () => {
    const a = buildBoard(CONFIG, pool, 'seed-A');
    const b = buildBoard(CONFIG, pool, 'seed-B');
    expect(a).not.toEqual(b);
  });

  it('has exactly one FREE center and 24 unique tasks', () => {
    for (const seed of ['s1', 's2', 's3', 'hello', 'LG-42']) {
      const board = buildBoard(CONFIG, pool, seed);
      expect(board).toHaveLength(25);

      const frees = board.filter((c) => c.free);
      expect(frees).toHaveLength(1);
      expect(board[12].free).toBe(true); // center index for 5x5

      const tasks = board.filter((c) => !c.free);
      expect(tasks).toHaveLength(24);
      const ids = tasks.map((t) => t.squareId);
      expect(new Set(ids).size).toBe(24);
    }
  });

  it('respects category minimums', () => {
    for (const seed of ['s1', 's2', 's3', 'another']) {
      const board = buildBoard(CONFIG, pool, seed);
      const counts: Record<string, number> = {};
      for (const cell of board) {
        if (cell.free || !cell.category) continue;
        counts[cell.category] = (counts[cell.category] ?? 0) + 1;
      }
      for (const cat of CATEGORIES) {
        expect(counts[cat.key] ?? 0).toBeGreaterThanOrEqual(cat.min);
      }
    }
  });

  it('never exceeds the hard-task cap', () => {
    for (const seed of ['s1', 's2', 's3', 'x9', 'zzz']) {
      const board = buildBoard(CONFIG, pool, seed);
      const hard = board.filter((c) => !c.free && c.difficulty === 3).length;
      expect(hard).toBeLessThanOrEqual(CONFIG.hardCap);
    }
  });
});

describe('detectWins', () => {
  const empty = () => Array(25).fill(false);

  it('returns no win for an empty board (FREE alone)', () => {
    const res = detectWins(empty(), TIERS, 5);
    expect(res.highestTier).toBeNull();
    expect(res.satisfied).toHaveLength(0);
  });

  it('detects a bingo on a full row', () => {
    const marked = empty();
    [0, 1, 2, 3, 4].forEach((i) => (marked[i] = true));
    const res = detectWins(marked, TIERS, 5);
    expect(res.satisfied.map((t) => t.key)).toContain('bingo');
    expect(res.highestTier?.key).toBe('bingo');
  });

  it('counts the FREE center as marked for the middle column', () => {
    const marked = empty();
    // center column indices 2,7,12,17,22 — leave 12 (center) unmarked
    [2, 7, 17, 22].forEach((i) => (marked[i] = true));
    const res = detectWins(marked, TIERS, 5);
    expect(res.satisfied.map((t) => t.key)).toContain('bingo');
  });

  it('detects four corners', () => {
    const marked = empty();
    [0, 4, 20, 24].forEach((i) => (marked[i] = true));
    const res = detectWins(marked, TIERS, 5);
    expect(res.satisfied.map((t) => t.key)).toContain('corners');
  });

  it('returns the highest tier when several patterns are satisfied (blackout)', () => {
    const marked = Array(25).fill(true);
    const res = detectWins(marked, TIERS, 5);
    expect(res.highestTier?.key).toBe('blackout');
    // blackout implies bingo, corners, plus, x are also satisfied
    expect(res.satisfied.length).toBe(TIERS.length);
  });

  it('detects the X (both diagonals)', () => {
    const marked = empty();
    [0, 6, 18, 24, 4, 8, 16, 20].forEach((i) => (marked[i] = true)); // 12 is FREE
    const res = detectWins(marked, TIERS, 5);
    expect(res.satisfied.map((t) => t.key)).toContain('x');
  });
});

describe('formatBoardCode', () => {
  it('is stable for a seed and uses the prefix', () => {
    const code = formatBoardCode('LG', 'seed-123');
    expect(code).toMatch(/^LG-[0-9A-Z]{5}$/);
    expect(formatBoardCode('LG', 'seed-123')).toBe(code);
  });

  it('hashSeed is a 32-bit unsigned int', () => {
    const h = hashSeed('anything');
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });
});
