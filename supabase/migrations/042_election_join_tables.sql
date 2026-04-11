-- =============================================================================
-- Election join tables — candidates and ballot measures
-- =============================================================================

-- ── Election Candidates ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.election_candidates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id     UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  party           TEXT,
  office          TEXT NOT NULL,
  incumbent       BOOLEAN DEFAULT false,
  website         TEXT,
  photo_url       TEXT,
  bio             TEXT,
  display_order   INT DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_election_candidates_election
  ON public.election_candidates(election_id);

ALTER TABLE public.election_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY election_candidates_select ON public.election_candidates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.elections e
      WHERE e.id = election_id
        AND (
          e.status = 'published'
          OR auth.uid() = e.author_id
          OR public.get_user_role() = 'super_admin'
          OR (public.get_user_role() = 'municipal_editor'
              AND e.region_id = ANY(public.get_user_region_ids()))
        )
    )
  );

CREATE POLICY election_candidates_insert ON public.election_candidates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.elections e
      WHERE e.id = election_id
        AND (
          public.get_user_role() = 'super_admin'
          OR (public.get_user_role() = 'municipal_editor'
              AND e.region_id = ANY(public.get_user_region_ids()))
        )
    )
  );

CREATE POLICY election_candidates_update ON public.election_candidates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.elections e
      WHERE e.id = election_id
        AND (
          public.get_user_role() = 'super_admin'
          OR (public.get_user_role() = 'municipal_editor'
              AND e.region_id = ANY(public.get_user_region_ids()))
        )
    )
  );

CREATE POLICY election_candidates_delete ON public.election_candidates FOR DELETE
  USING (public.get_user_role() = 'super_admin');


-- ── Ballot Measures ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.ballot_measures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id     UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  measure_type    TEXT CHECK (measure_type IN ('levy', 'millage', 'amendment', 'referendum', 'initiative')),
  full_text_url   TEXT,
  display_order   INT DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ballot_measures_election
  ON public.ballot_measures(election_id);

ALTER TABLE public.ballot_measures ENABLE ROW LEVEL SECURITY;

CREATE POLICY ballot_measures_select ON public.ballot_measures FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.elections e
      WHERE e.id = election_id
        AND (
          e.status = 'published'
          OR auth.uid() = e.author_id
          OR public.get_user_role() = 'super_admin'
          OR (public.get_user_role() = 'municipal_editor'
              AND e.region_id = ANY(public.get_user_region_ids()))
        )
    )
  );

CREATE POLICY ballot_measures_insert ON public.ballot_measures FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.elections e
      WHERE e.id = election_id
        AND (
          public.get_user_role() = 'super_admin'
          OR (public.get_user_role() = 'municipal_editor'
              AND e.region_id = ANY(public.get_user_region_ids()))
        )
    )
  );

CREATE POLICY ballot_measures_update ON public.ballot_measures FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.elections e
      WHERE e.id = election_id
        AND (
          public.get_user_role() = 'super_admin'
          OR (public.get_user_role() = 'municipal_editor'
              AND e.region_id = ANY(public.get_user_region_ids()))
        )
    )
  );

CREATE POLICY ballot_measures_delete ON public.ballot_measures FOR DELETE
  USING (public.get_user_role() = 'super_admin');
