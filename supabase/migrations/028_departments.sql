-- =============================================================================
-- Departments — organizational backbone for municipal content
-- =============================================================================

-- 1. Create departments table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.departments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id             UUID NOT NULL REFERENCES public.regions(id),
  slug                  TEXT NOT NULL,
  name                  TEXT NOT NULL,
  short_name            TEXT,
  description           TEXT,
  body                  TEXT,
  phone                 TEXT,
  fax                   TEXT,
  email                 TEXT,
  address               TEXT,
  hours                 TEXT,
  website               TEXT,
  hero_image_url        TEXT,
  icon                  TEXT,
  display_order         INT DEFAULT 0,
  hide_from_nav         BOOLEAN DEFAULT false,
  parent_department_id  UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  status                TEXT NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'published', 'archived')),
  author_id             UUID REFERENCES public.profiles(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now(),
  published_at          TIMESTAMPTZ,
  UNIQUE(region_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_departments_region
  ON public.departments(region_id);
CREATE INDEX IF NOT EXISTS idx_departments_parent
  ON public.departments(parent_department_id) WHERE parent_department_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_departments_status
  ON public.departments(status);

-- updated_at trigger
CREATE TRIGGER trg_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. RLS — region-scoped pattern
-- =============================================================================

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY departments_select ON public.departments FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY departments_insert ON public.departments FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY departments_update ON public.departments FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY departments_delete ON public.departments FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- 3. Expand categories content_type for all new types
-- =============================================================================

ALTER TABLE public.categories
  DROP CONSTRAINT IF EXISTS categories_content_type_check;

ALTER TABLE public.categories
  ADD CONSTRAINT categories_content_type_check
  CHECK (content_type IN (
    'events', 'news', 'guides', 'ordinances',
    'departments', 'boards_commissions', 'meetings',
    'public_notices', 'forms_documents', 'services',
    'facilities', 'job_postings', 'faqs'
  ));
