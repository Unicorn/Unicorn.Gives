-- =============================================================================
-- Events — add department/board linking, public meeting support
-- =============================================================================

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS board_id UUID REFERENCES public.boards_commissions(id) ON DELETE SET NULL;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS is_public_meeting BOOLEAN DEFAULT false;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS agenda_url TEXT;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'community'
    CHECK (event_type IN (
      'community', 'recreation', 'government_meeting',
      'public_hearing', 'holiday', 'other'
    ));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_department
  ON public.events(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_board
  ON public.events(board_id) WHERE board_id IS NOT NULL;
