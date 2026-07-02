-- =============================================================================
-- Bingo Claims — win-claim submissions (schema hook; admin review UI deferred)
-- =============================================================================
-- Players submit a claim for a win tier they achieved; staff confirm at the
-- in-person event. The review/approval admin screen is a later phase — this
-- table exists now so board play can record claims without a follow-up migration.

CREATE TABLE IF NOT EXISTS public.bingo_claims (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id      UUID NOT NULL REFERENCES public.bingo_boards(id) ON DELETE CASCADE,
  game_id       UUID NOT NULL REFERENCES public.bingo_games(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier          TEXT NOT NULL,                 -- win tier key claimed
  story         TEXT,                          -- player's story / notes
  status        TEXT NOT NULL DEFAULT 'submitted'
                  CHECK (status IN ('submitted', 'approved', 'rejected')),
  reviewer_notes TEXT,
  reviewed_by   UUID REFERENCES public.profiles(id),
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bingo_claims_game   ON public.bingo_claims(game_id);
CREATE INDEX IF NOT EXISTS idx_bingo_claims_user   ON public.bingo_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_bingo_claims_status ON public.bingo_claims(status);

CREATE TRIGGER trg_bingo_claims_updated_at
  BEFORE UPDATE ON public.bingo_claims
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.bingo_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY bingo_claims_select ON public.bingo_claims FOR SELECT
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

CREATE POLICY bingo_claims_insert ON public.bingo_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Owners may edit their pending story; staff may review (update status/notes).
CREATE POLICY bingo_claims_update ON public.bingo_claims FOR UPDATE
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

CREATE POLICY bingo_claims_delete ON public.bingo_claims FOR DELETE
  USING (auth.uid() = user_id OR public.get_user_role() = 'super_admin');
