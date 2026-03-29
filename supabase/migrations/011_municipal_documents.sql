-- =============================================================================
-- Municipal official documents (PDF + structured highlights), scoped by region
-- =============================================================================

CREATE TABLE public.municipal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES public.regions(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'other'
    CHECK (kind IN ('master_plan', 'zoning_ordinance', 'recreation_plan', 'other')),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  adopted_date TEXT NOT NULL,
  adopted_by TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  pdf_size_label TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '[]'::jsonb,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  table_of_contents JSONB,
  display_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  UNIQUE (region_id, slug)
);

CREATE INDEX idx_municipal_documents_region ON public.municipal_documents(region_id);
CREATE INDEX idx_municipal_documents_region_status ON public.municipal_documents(region_id, status);

ALTER TABLE public.municipal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY municipal_documents_select ON public.municipal_documents FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY municipal_documents_insert ON public.municipal_documents FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY municipal_documents_update ON public.municipal_documents FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY municipal_documents_delete ON public.municipal_documents FOR DELETE
  USING (public.get_user_role() = 'super_admin');
