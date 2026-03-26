-- =============================================================================
-- Add tags column to events for taxonomy chips/filtering
-- =============================================================================

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_events_tags ON public.events USING GIN (tags);
