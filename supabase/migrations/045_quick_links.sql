-- =============================================================================
-- Quick Links — configurable link tiles for homepage, I-want-to, footer, etc.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.quick_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  url             TEXT NOT NULL,
  description     TEXT,
  icon            TEXT,
  link_group      TEXT DEFAULT 'homepage_tiles'
                    CHECK (link_group IN ('homepage_tiles', 'i_want_to', 'footer', 'utility_bar')),
  is_external     BOOLEAN DEFAULT false,
  open_in_new_tab BOOLEAN DEFAULT false,
  display_order   INT DEFAULT 0,
  region_id       UUID REFERENCES public.regions(id),
  status          TEXT NOT NULL DEFAULT 'published'
                    CHECK (status IN ('draft', 'published', 'archived')),
  author_id       UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quick_links_region
  ON public.quick_links(region_id) WHERE region_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quick_links_status
  ON public.quick_links(status);
CREATE INDEX IF NOT EXISTS idx_quick_links_group
  ON public.quick_links(link_group);

CREATE TRIGGER trg_quick_links_updated_at
  BEFORE UPDATE ON public.quick_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — publicly readable (published), super_admin writable
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY quick_links_select ON public.quick_links FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY quick_links_insert ON public.quick_links FOR INSERT
  WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY quick_links_update ON public.quick_links FOR UPDATE
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY quick_links_delete ON public.quick_links FOR DELETE
  USING (public.get_user_role() = 'super_admin');
