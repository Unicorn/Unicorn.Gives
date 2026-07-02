-- =============================================================================
-- Public read of a bingo board by its shareable code
-- =============================================================================
-- bingo_boards RLS restricts SELECT to the owner (and staff). To support a
-- shareable, read-only board link, this SECURITY DEFINER function returns only
-- the safe, non-sensitive fields for a board whose game is published. It never
-- exposes user_id or the seed.

CREATE OR REPLACE FUNCTION public.get_bingo_board(p_code TEXT)
RETURNS TABLE (
  board_code   TEXT,
  cells        JSONB,
  marked       JSONB,
  highest_tier TEXT,
  is_saved     BOOLEAN,
  created_at   TIMESTAMPTZ,
  game_slug    TEXT,
  game_title   TEXT,
  board_size   INT,
  categories   JSONB,
  win_tiers    JSONB
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    b.board_code,
    b.cells,
    b.marked,
    b.highest_tier,
    b.is_saved,
    b.created_at,
    g.slug,
    g.title,
    g.board_size,
    g.categories,
    g.win_tiers
  FROM public.bingo_boards b
  JOIN public.bingo_games g ON g.id = b.game_id
  WHERE b.board_code = p_code
    AND g.status = 'published';
$$;

GRANT EXECUTE ON FUNCTION public.get_bingo_board(TEXT) TO anon, authenticated;
