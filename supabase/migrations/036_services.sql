-- =============================================================================
-- Services — municipal services offered to residents and businesses
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.services (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id         UUID NOT NULL REFERENCES public.regions(id),
  slug              TEXT NOT NULL,
  name              TEXT NOT NULL,
  description       TEXT,
  body              TEXT,
  department_id     UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  service_category  TEXT NOT NULL DEFAULT 'administrative'
                      CHECK (service_category IN (
                        'utilities', 'permits_licensing', 'public_safety',
                        'recreation', 'public_works', 'administrative',
                        'health', 'other'
                      )),
  audience          TEXT DEFAULT 'both'
                      CHECK (audience IN ('residents', 'businesses', 'both', 'internal')),
  online_url        TEXT,
  fee_schedule      TEXT,
  eligibility       TEXT,
  hours             TEXT,
  phone             TEXT,
  email             TEXT,
  icon              TEXT,
  display_order     INT DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published', 'archived')),
  author_id         UUID REFERENCES public.profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  published_at      TIMESTAMPTZ,
  UNIQUE(region_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_services_region
  ON public.services(region_id);
CREATE INDEX IF NOT EXISTS idx_services_status
  ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_department
  ON public.services(department_id) WHERE department_id IS NOT NULL;

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — region-scoped
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY services_select ON public.services FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY services_insert ON public.services FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY services_update ON public.services FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY services_delete ON public.services FOR DELETE
  USING (public.get_user_role() = 'super_admin');
