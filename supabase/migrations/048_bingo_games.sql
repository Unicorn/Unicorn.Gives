-- =============================================================================
-- Bingo Games — admin-curated bingo game definitions
-- =============================================================================
-- A bingo game is a CMS content type (like events): staff curate a square pool,
-- category minimums, win tiers, and rules/legal copy, then publish. Players are
-- issued server-side boards drawn from the game's pool (see 050_bingo_boards).
-- Scope follows the events pattern: nullable region_id + partner_id.

CREATE TABLE IF NOT EXISTS public.bingo_games (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,
  title             TEXT NOT NULL,
  subtitle          TEXT,
  description       TEXT,
  body              TEXT,
  cover_image_url   TEXT,

  -- Scope (events pattern: a game may belong to a region, a partner, or neither)
  region_id         UUID REFERENCES public.regions(id),
  partner_id        UUID REFERENCES public.partners(id),
  featured          BOOLEAN DEFAULT false,

  -- Season / claim window
  starts_on         DATE,
  ends_on           DATE,
  claim_event_date  DATE,            -- e.g. the "Labor Day Story Party"

  -- Board generation config (read by buildBoard at issue time)
  board_size        INT NOT NULL DEFAULT 5 CHECK (board_size BETWEEN 3 AND 7),
  hard_cap          INT NOT NULL DEFAULT 6 CHECK (hard_cap >= 0),
  free_space_label  TEXT NOT NULL DEFAULT 'FREE',
  allow_reroll      BOOLEAN NOT NULL DEFAULT false,

  -- Age gate
  age_gate_required BOOLEAN NOT NULL DEFAULT true,
  age_gate_min      INT NOT NULL DEFAULT 18,

  -- Config as JSONB (admin-editable, drives the generator + win detection)
  -- categories: [{ key, label, color, min }]
  categories        JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- win_tiers: [{ key, label, pattern, prize, rank }]
  --   pattern ∈ row | column | diagonal | bingo | corners | plus | x | blackout
  win_tiers         JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Verbatim content surfaced in-app
  rules_md          TEXT,           -- "How to Play"
  disclaimer_md     TEXT,           -- legal terms / release

  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published', 'archived')),
  tags              TEXT[] DEFAULT '{}',
  display_order     INT DEFAULT 0,
  author_id         UUID REFERENCES public.profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  published_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bingo_games_status   ON public.bingo_games(status);
CREATE INDEX IF NOT EXISTS idx_bingo_games_region   ON public.bingo_games(region_id)  WHERE region_id  IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bingo_games_partner  ON public.bingo_games(partner_id) WHERE partner_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bingo_games_featured ON public.bingo_games(featured)   WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_bingo_games_tags     ON public.bingo_games USING GIN (tags);

CREATE TRIGGER trg_bingo_games_updated_at
  BEFORE UPDATE ON public.bingo_games
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — published is public; super_admin, region/partner editors manage in scope
ALTER TABLE public.bingo_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY bingo_games_select ON public.bingo_games FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND (region_id IS NULL OR region_id = ANY(public.get_user_region_ids())))
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

CREATE POLICY bingo_games_insert ON public.bingo_games FOR INSERT
  WITH CHECK (
    public.get_user_role() IN ('super_admin', 'municipal_editor', 'partner_editor')
  );

CREATE POLICY bingo_games_update ON public.bingo_games FOR UPDATE
  USING (
    auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND (region_id IS NULL OR region_id = ANY(public.get_user_region_ids())))
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

CREATE POLICY bingo_games_delete ON public.bingo_games FOR DELETE
  USING (public.get_user_role() = 'super_admin');
