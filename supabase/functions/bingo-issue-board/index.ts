/**
 * Bingo Issue Board Edge Function — user-facing.
 *
 * Issues (or returns) a player's board for a published bingo game. Boards are
 * built server-side from a crypto seed so they can't be reverse-engineered, and
 * the drawn 25 cells are snapshotted so later pool edits don't mutate the board.
 *
 * Requires Authorization: Bearer <user jwt>.
 *
 * POST { game_id, age_confirmed? }
 *   → { board: { id, board_code, cells, marked, ... } }
 *   - Existing board is returned as-is unless the game allows rerolls.
 *
 * Deploy: `supabase functions deploy bingo-issue-board`
 * Config: `[functions.bingo-issue-board] verify_jwt = false` (we verify the JWT
 *          manually below so we can return friendly 401s).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { corsHeaders, json } from '../_shared/cors.ts';
import {
  buildBoard,
  formatBoardCode,
  prefixFromSlug,
  type BingoCategory,
  type BingoSquare,
  type BoardConfig,
} from '../_shared/bingoEngine.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
    if (!jwt) return json({ error: 'Sign in required' }, 401);

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes.user) return json({ error: 'Invalid session' }, 401);
    const userId = userRes.user.id;

    const body = (await req.json().catch(() => ({}))) as {
      game_id?: string;
      age_confirmed?: boolean;
    };
    if (!body.game_id) return json({ error: 'game_id is required' }, 400);

    const admin = createClient(supabaseUrl, serviceKey);

    // Load the game (must be published to be playable).
    const { data: game, error: gameErr } = await admin
      .from('bingo_games')
      .select(
        'id, slug, status, board_size, hard_cap, free_space_label, allow_reroll, age_gate_required, categories',
      )
      .eq('id', body.game_id)
      .single();
    if (gameErr || !game) return json({ error: 'Game not found' }, 404);
    if (game.status !== 'published') return json({ error: 'Game is not available' }, 403);

    if (game.age_gate_required && !body.age_confirmed) {
      return json({ error: 'Age confirmation required' }, 403);
    }

    // Return the existing board unless rerolls are allowed.
    const { data: existing } = await admin
      .from('bingo_boards')
      .select('*')
      .eq('game_id', game.id)
      .eq('user_id', userId)
      .maybeSingle();

    const ageConfirmedAt = body.age_confirmed ? new Date().toISOString() : null;

    if (existing && !game.allow_reroll) {
      // Record age confirmation if it wasn't captured before.
      if (ageConfirmedAt && !existing.age_confirmed_at) {
        await admin
          .from('bingo_boards')
          .update({ age_confirmed_at: ageConfirmedAt })
          .eq('id', existing.id);
        existing.age_confirmed_at = ageConfirmedAt;
      }
      return json({ board: existing, reused: true });
    }

    // Load the active square pool.
    const { data: squares, error: sqErr } = await admin
      .from('bingo_squares')
      .select('id, text, category, difficulty')
      .eq('game_id', game.id)
      .eq('is_active', true);
    if (sqErr) return json({ error: 'Failed to load squares' }, 500);

    const total = game.board_size * game.board_size;
    if (!squares || squares.length < total - 1) {
      return json({ error: 'This game does not have enough squares yet' }, 409);
    }

    const config: BoardConfig = {
      boardSize: game.board_size,
      hardCap: game.hard_cap,
      freeSpaceLabel: game.free_space_label ?? 'FREE',
      categories: (game.categories ?? []) as BingoCategory[],
    };
    const pool = squares as BingoSquare[];
    const prefix = prefixFromSlug(game.slug);

    // Crypto seed → board. Retry on the (rare) board_code collision.
    let board = null;
    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const seed = crypto.randomUUID();
      const cells = buildBoard(config, pool, seed);
      const boardCode = formatBoardCode(prefix, seed);

      const row = {
        game_id: game.id,
        user_id: userId,
        board_code: boardCode,
        seed,
        cells,
        marked: [],
        highest_tier: null,
        age_confirmed_at: ageConfirmedAt ?? existing?.age_confirmed_at ?? null,
      };

      let result;
      if (existing) {
        result = await admin
          .from('bingo_boards')
          .update(row)
          .eq('id', existing.id)
          .select('*')
          .single();
      } else {
        result = await admin.from('bingo_boards').insert(row).select('*').single();
      }

      if (!result.error) {
        board = result.data;
        break;
      }
      lastErr = result.error;
      // 23505 = unique_violation (board_code collision) → retry with a new seed.
      if (result.error.code !== '23505') break;
    }

    if (!board) {
      return json({ error: 'Could not issue a board', detail: String(lastErr) }, 500);
    }

    return json({ board, reused: false });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unexpected error' }, 500);
  }
});
