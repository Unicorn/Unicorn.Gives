-- =============================================================================
-- Meetings — scheduled public meetings linked to boards and minutes
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.meetings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id         UUID NOT NULL REFERENCES public.regions(id),
  slug              TEXT NOT NULL,
  title             TEXT NOT NULL,
  board_id          UUID REFERENCES public.boards_commissions(id) ON DELETE SET NULL,
  meeting_type      TEXT NOT NULL DEFAULT 'regular'
                      CHECK (meeting_type IN (
                        'regular', 'special', 'emergency', 'work_session', 'public_hearing'
                      )),
  meeting_date      DATE NOT NULL,
  start_time        TEXT,
  end_time          TEXT,
  location          TEXT,
  location_url      TEXT,
  agenda_url        TEXT,
  agenda_body       TEXT,
  packet_url        TEXT,
  video_url         TEXT,
  minutes_id        UUID REFERENCES public.minutes(id) ON DELETE SET NULL,
  is_cancelled      BOOLEAN DEFAULT false,
  cancellation_notice TEXT,
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published', 'archived')),
  author_id         UUID REFERENCES public.profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  published_at      TIMESTAMPTZ,
  UNIQUE(region_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_meetings_region
  ON public.meetings(region_id);
CREATE INDEX IF NOT EXISTS idx_meetings_board
  ON public.meetings(board_id) WHERE board_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_meetings_date
  ON public.meetings(meeting_date DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_status
  ON public.meetings(status);

CREATE TRIGGER trg_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — region-scoped
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY meetings_select ON public.meetings FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY meetings_insert ON public.meetings FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY meetings_update ON public.meetings FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY meetings_delete ON public.meetings FOR DELETE
  USING (public.get_user_role() = 'super_admin');
