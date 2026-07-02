-- =============================================================================
-- Bingo Squares — the pool of tasks for a bingo game
-- =============================================================================
-- One-to-many from bingo_games. Each square has a category (a key into the
-- parent game's `categories` JSONB) and a difficulty (1 easy .. 3 hard). The
-- generator draws boards from the active squares, honoring category minimums
-- and the game's hard cap on difficulty-3 squares.

CREATE TABLE IF NOT EXISTS public.bingo_squares (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id       UUID NOT NULL REFERENCES public.bingo_games(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  category      TEXT NOT NULL,
  difficulty    INT NOT NULL DEFAULT 1 CHECK (difficulty IN (1, 2, 3)),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  display_order INT DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bingo_squares_game     ON public.bingo_squares(game_id);
CREATE INDEX IF NOT EXISTS idx_bingo_squares_active   ON public.bingo_squares(game_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_bingo_squares_category ON public.bingo_squares(game_id, category);

CREATE TRIGGER trg_bingo_squares_updated_at
  BEFORE UPDATE ON public.bingo_squares
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — visibility follows the parent game (same pattern as election_candidates)
ALTER TABLE public.bingo_squares ENABLE ROW LEVEL SECURITY;

CREATE POLICY bingo_squares_select ON public.bingo_squares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bingo_games g
      WHERE g.id = game_id
        AND (
          g.status = 'published'
          OR auth.uid() = g.author_id
          OR public.get_user_role() = 'super_admin'
          OR (public.get_user_role() = 'municipal_editor' AND (g.region_id IS NULL OR g.region_id = ANY(public.get_user_region_ids())))
          OR (public.get_user_role() = 'partner_editor' AND g.partner_id = public.get_user_partner_id())
        )
    )
  );

CREATE POLICY bingo_squares_insert ON public.bingo_squares FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bingo_games g
      WHERE g.id = game_id
        AND (
          public.get_user_role() = 'super_admin'
          OR (public.get_user_role() = 'municipal_editor' AND (g.region_id IS NULL OR g.region_id = ANY(public.get_user_region_ids())))
          OR (public.get_user_role() = 'partner_editor' AND g.partner_id = public.get_user_partner_id())
        )
    )
  );

CREATE POLICY bingo_squares_update ON public.bingo_squares FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bingo_games g
      WHERE g.id = game_id
        AND (
          public.get_user_role() = 'super_admin'
          OR (public.get_user_role() = 'municipal_editor' AND (g.region_id IS NULL OR g.region_id = ANY(public.get_user_region_ids())))
          OR (public.get_user_role() = 'partner_editor' AND g.partner_id = public.get_user_partner_id())
        )
    )
  );

CREATE POLICY bingo_squares_delete ON public.bingo_squares FOR DELETE
  USING (public.get_user_role() = 'super_admin');
