-- =============================================================================
-- Bingo boards: explicit "saved/locked" state
-- =============================================================================
-- A freshly-issued board is a draft the player can reroll freely. Once they
-- like their squares they "save" it. Rerolling a saved board (or one with
-- progress) warns them they'll lose progress. The immutable-column guard in
-- 050 already lets the owner update marked/highest_tier/is_saved/saved_at.

ALTER TABLE public.bingo_boards
  ADD COLUMN IF NOT EXISTS is_saved BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS saved_at TIMESTAMPTZ;
