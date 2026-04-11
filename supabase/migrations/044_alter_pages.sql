-- =============================================================================
-- Pages — add department linking, hierarchy, page types, audience & template
-- =============================================================================

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS parent_page_id UUID REFERENCES public.pages(id) ON DELETE SET NULL;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS page_type TEXT DEFAULT 'standard'
    CHECK (page_type IN ('standard', 'department_landing', 'service_landing', 'redirect', 'landing_page'));

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS redirect_url TEXT;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS audience TEXT
    CHECK (audience IN ('all', 'residents', 'businesses', 'visitors', 'internal'));

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS template TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pages_department
  ON public.pages(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pages_parent_page
  ON public.pages(parent_page_id) WHERE parent_page_id IS NOT NULL;
