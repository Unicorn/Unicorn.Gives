-- =============================================================================
-- News — add department linking, public notice support, and expiration
-- =============================================================================

ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS is_public_notice BOOLEAN DEFAULT false;

ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS notice_type TEXT
    CHECK (notice_type IN (
      'public_hearing', 'ordinance_change', 'road_closure',
      'utility', 'emergency', 'meeting', 'general'
    ));

ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS expiration_date DATE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_department
  ON public.news(department_id) WHERE department_id IS NOT NULL;
