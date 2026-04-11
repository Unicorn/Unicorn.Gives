-- =============================================================================
-- Forms & Documents — downloadable forms, permits, policies, and guides
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.forms_documents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id         UUID NOT NULL REFERENCES public.regions(id),
  slug              TEXT NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  document_type     TEXT NOT NULL DEFAULT 'form'
                      CHECK (document_type IN (
                        'form', 'permit', 'application', 'policy', 'plan',
                        'report', 'brochure', 'guide', 'template', 'other'
                      )),
  file_url          TEXT NOT NULL,
  file_size_label   TEXT,
  file_format       TEXT DEFAULT 'pdf',
  department_id     UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  category_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  form_number       TEXT,
  effective_date    DATE,
  revision_date     DATE,
  supersedes_id     UUID REFERENCES public.forms_documents(id) ON DELETE SET NULL,
  is_fillable       BOOLEAN DEFAULT false,
  is_current        BOOLEAN DEFAULT true,
  submission_url    TEXT,
  instructions      TEXT,
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
CREATE INDEX IF NOT EXISTS idx_forms_documents_region
  ON public.forms_documents(region_id);
CREATE INDEX IF NOT EXISTS idx_forms_documents_status
  ON public.forms_documents(status);
CREATE INDEX IF NOT EXISTS idx_forms_documents_department
  ON public.forms_documents(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_forms_documents_category
  ON public.forms_documents(category_id) WHERE category_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_forms_documents_supersedes
  ON public.forms_documents(supersedes_id) WHERE supersedes_id IS NOT NULL;

CREATE TRIGGER trg_forms_documents_updated_at
  BEFORE UPDATE ON public.forms_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — region-scoped
ALTER TABLE public.forms_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY forms_documents_select ON public.forms_documents FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY forms_documents_insert ON public.forms_documents FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY forms_documents_update ON public.forms_documents FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY forms_documents_delete ON public.forms_documents FOR DELETE
  USING (public.get_user_role() = 'super_admin');
