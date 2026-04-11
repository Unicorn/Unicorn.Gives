-- =============================================================================
-- Job Postings — municipal employment opportunities and volunteer positions
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.job_postings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id         UUID NOT NULL REFERENCES public.regions(id),
  slug              TEXT NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  body              TEXT,
  department_id     UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  employment_type   TEXT NOT NULL DEFAULT 'full_time'
                      CHECK (employment_type IN (
                        'full_time', 'part_time', 'seasonal', 'volunteer', 'internship'
                      )),
  salary_range      TEXT,
  benefits_summary  TEXT,
  qualifications    TEXT,
  application_url   TEXT,
  posting_date      DATE DEFAULT CURRENT_DATE,
  closing_date      DATE,
  is_open           BOOLEAN DEFAULT true,
  contact_name      TEXT,
  contact_email     TEXT,
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published', 'archived')),
  author_id         UUID REFERENCES public.profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  published_at      TIMESTAMPTZ,
  UNIQUE(region_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_job_postings_region
  ON public.job_postings(region_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status
  ON public.job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_department
  ON public.job_postings(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_job_postings_open
  ON public.job_postings(is_open) WHERE is_open = true;

CREATE TRIGGER trg_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — region-scoped
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY job_postings_select ON public.job_postings FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY job_postings_insert ON public.job_postings FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY job_postings_update ON public.job_postings FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY job_postings_delete ON public.job_postings FOR DELETE
  USING (public.get_user_role() = 'super_admin');
