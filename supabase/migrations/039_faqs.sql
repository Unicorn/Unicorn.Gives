-- =============================================================================
-- FAQs — frequently asked questions scoped by department and audience
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.faqs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id         UUID NOT NULL REFERENCES public.regions(id),
  slug              TEXT NOT NULL,
  question          TEXT NOT NULL,
  answer            TEXT NOT NULL,
  department_id     UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  category_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  audience          TEXT DEFAULT 'both'
                      CHECK (audience IN ('residents', 'businesses', 'both', 'visitors')),
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
CREATE INDEX IF NOT EXISTS idx_faqs_region
  ON public.faqs(region_id);
CREATE INDEX IF NOT EXISTS idx_faqs_status
  ON public.faqs(status);
CREATE INDEX IF NOT EXISTS idx_faqs_department
  ON public.faqs(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_faqs_category
  ON public.faqs(category_id) WHERE category_id IS NOT NULL;

CREATE TRIGGER trg_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — region-scoped
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY faqs_select ON public.faqs FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY faqs_insert ON public.faqs FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY faqs_update ON public.faqs FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY faqs_delete ON public.faqs FOR DELETE
  USING (public.get_user_role() = 'super_admin');
