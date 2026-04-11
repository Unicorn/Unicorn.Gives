-- =============================================================================
-- Nav Menus — configurable navigation menus and menu items
-- =============================================================================

-- ── Nav Menus ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.nav_menus (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  location        TEXT DEFAULT 'header'
                    CHECK (location IN ('header', 'footer', 'sidebar', 'utility_bar', 'mobile')),
  region_id       UUID REFERENCES public.regions(id),
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nav_menus_region
  ON public.nav_menus(region_id) WHERE region_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nav_menus_location
  ON public.nav_menus(location);

CREATE TRIGGER trg_nav_menus_updated_at
  BEFORE UPDATE ON public.nav_menus
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.nav_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY nav_menus_select ON public.nav_menus FOR SELECT
  USING (true);

CREATE POLICY nav_menus_insert ON public.nav_menus FOR INSERT
  WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY nav_menus_update ON public.nav_menus FOR UPDATE
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY nav_menus_delete ON public.nav_menus FOR DELETE
  USING (public.get_user_role() = 'super_admin');


-- ── Nav Menu Items ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.nav_menu_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id         UUID NOT NULL REFERENCES public.nav_menus(id) ON DELETE CASCADE,
  parent_item_id  UUID REFERENCES public.nav_menu_items(id) ON DELETE CASCADE,
  label           TEXT NOT NULL,
  url             TEXT,
  icon            TEXT,
  content_type    TEXT,
  content_id      UUID,
  open_in_new_tab BOOLEAN DEFAULT false,
  display_order   INT DEFAULT 0,
  is_visible      BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nav_menu_items_menu
  ON public.nav_menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_nav_menu_items_parent
  ON public.nav_menu_items(parent_item_id) WHERE parent_item_id IS NOT NULL;

CREATE TRIGGER trg_nav_menu_items_updated_at
  BEFORE UPDATE ON public.nav_menu_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.nav_menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY nav_menu_items_select ON public.nav_menu_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.nav_menus m
      WHERE m.id = menu_id AND m.is_active = true
    )
    OR public.get_user_role() = 'super_admin'
  );

CREATE POLICY nav_menu_items_insert ON public.nav_menu_items FOR INSERT
  WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY nav_menu_items_update ON public.nav_menu_items FOR UPDATE
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY nav_menu_items_delete ON public.nav_menu_items FOR DELETE
  USING (public.get_user_role() = 'super_admin');
