-- =============================================================================
-- Audiences — reusable taxonomy for content targeting
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.audiences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  label           TEXT NOT NULL,
  description     TEXT,
  display_order   INT DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_audiences_updated_at
  BEFORE UPDATE ON public.audiences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial data
INSERT INTO public.audiences (slug, label, description, display_order) VALUES
  ('residents',  'Residents',  'Content for local residents',         0),
  ('businesses', 'Businesses', 'Content for local businesses',        1),
  ('visitors',   'Visitors',   'Content for visitors and tourists',   2)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.audiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY audiences_select ON public.audiences FOR SELECT
  USING (true);

CREATE POLICY audiences_insert ON public.audiences FOR INSERT
  WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY audiences_update ON public.audiences FOR UPDATE
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY audiences_delete ON public.audiences FOR DELETE
  USING (public.get_user_role() = 'super_admin');


-- ── Content–Audience join (polymorphic) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.content_audiences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audience_id     UUID NOT NULL REFERENCES public.audiences(id) ON DELETE CASCADE,
  content_type    TEXT NOT NULL,
  content_id      UUID NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(audience_id, content_type, content_id)
);

CREATE INDEX IF NOT EXISTS idx_content_audiences_content
  ON public.content_audiences(content_type, content_id);

ALTER TABLE public.content_audiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_audiences_select ON public.content_audiences FOR SELECT
  USING (true);

CREATE POLICY content_audiences_insert ON public.content_audiences FOR INSERT
  WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY content_audiences_update ON public.content_audiences FOR UPDATE
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY content_audiences_delete ON public.content_audiences FOR DELETE
  USING (public.get_user_role() = 'super_admin');
