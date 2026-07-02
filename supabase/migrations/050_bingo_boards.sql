-- =============================================================================
-- Bingo Boards — server-issued, per-player boards
-- =============================================================================
-- Boards are issued by the `bingo-issue-board` edge function (service role)
-- using a crypto seed, so they can't be reverse-engineered. The drawn 25 cells
-- are snapshotted into `cells` at issue time, so later edits to the square pool
-- never mutate an issued board. Players mark cells (RLS-guarded update on their
-- own row); win detection runs client-side off the snapshot for the live banner.

CREATE TABLE IF NOT EXISTS public.bingo_boards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id         UUID NOT NULL REFERENCES public.bingo_games(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  board_code      TEXT UNIQUE NOT NULL,         -- human ID, e.g. "LG-7K2QX"
  seed            TEXT NOT NULL,                 -- crypto seed used to build the board
  cells           JSONB NOT NULL,               -- snapshot: 25 entries {square_id|null, text, category, difficulty, free}
  marked          JSONB NOT NULL DEFAULT '[]'::jsonb,  -- marked cell indices
  highest_tier    TEXT,                          -- cached highest win tier key
  age_confirmed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(game_id, user_id)                       -- one active board per player per game
);

CREATE INDEX IF NOT EXISTS idx_bingo_boards_user ON public.bingo_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_bingo_boards_game ON public.bingo_boards(game_id);

CREATE TRIGGER trg_bingo_boards_updated_at
  BEFORE UPDATE ON public.bingo_boards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — players read/update their own board; editors may read all for a game.
-- INSERT is intentionally omitted: boards are created by the edge function with
-- the service-role key, which bypasses RLS.
ALTER TABLE public.bingo_boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY bingo_boards_select ON public.bingo_boards FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.get_user_role() = 'super_admin'
    OR EXISTS (
      SELECT 1 FROM public.bingo_games g
      WHERE g.id = game_id
        AND (
          (public.get_user_role() = 'municipal_editor' AND (g.region_id IS NULL OR g.region_id = ANY(public.get_user_region_ids())))
          OR (public.get_user_role() = 'partner_editor' AND g.partner_id = public.get_user_partner_id())
        )
    )
  );

-- Players may only mark/unmark cells on their own board. A trigger guards the
-- immutable columns (cells, seed, board_code) against tampering.
CREATE POLICY bingo_boards_update ON public.bingo_boards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY bingo_boards_delete ON public.bingo_boards FOR DELETE
  USING (auth.uid() = user_id OR public.get_user_role() = 'super_admin');

-- Prevent players from rewriting the board composition via a direct UPDATE.
CREATE OR REPLACE FUNCTION public.bingo_boards_guard_immutable()
RETURNS TRIGGER AS $$
BEGIN
  IF public.get_user_role() <> 'super_admin' THEN
    NEW.cells      := OLD.cells;
    NEW.seed       := OLD.seed;
    NEW.board_code := OLD.board_code;
    NEW.game_id    := OLD.game_id;
    NEW.user_id    := OLD.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_bingo_boards_guard_immutable
  BEFORE UPDATE ON public.bingo_boards
  FOR EACH ROW EXECUTE FUNCTION public.bingo_boards_guard_immutable();
