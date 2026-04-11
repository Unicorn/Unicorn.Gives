-- =============================================================================
-- Minutes — link to meetings and boards, add approval tracking
-- =============================================================================

ALTER TABLE public.minutes
  ADD COLUMN IF NOT EXISTS meeting_id UUID REFERENCES public.meetings(id) ON DELETE SET NULL;

ALTER TABLE public.minutes
  ADD COLUMN IF NOT EXISTS board_id UUID REFERENCES public.boards_commissions(id) ON DELETE SET NULL;

ALTER TABLE public.minutes
  ADD COLUMN IF NOT EXISTS approval_date DATE;

ALTER TABLE public.minutes
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending'
    CHECK (approval_status IN ('pending', 'approved', 'tabled'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_minutes_meeting
  ON public.minutes(meeting_id) WHERE meeting_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_minutes_board
  ON public.minutes(board_id) WHERE board_id IS NOT NULL;
