-- =============================================================================
-- Partner Types (Clubs, Salons, etc.)
-- =============================================================================
-- Purpose:
--   - Introduce a normalized partner type concept for type-specific fields.
--   - Backfill existing partners with type assignments.
--   - Seed default tab definitions per type.
--
-- Notes:
--   - `public.partners.tabs` remains supported as an override.
--   - App will later use `partner_types.default_tabs` when `partners.tabs` is
--     not provided.
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.partner_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  default_tabs JSONB NOT NULL DEFAULT '[]'::jsonb,
  type_data_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_types ENABLE ROW LEVEL SECURITY;

-- Public can read partner types.
CREATE POLICY partner_types_select ON public.partner_types
FOR SELECT
USING (true);

-- Writes are restricted to admins.
CREATE POLICY partner_types_insert ON public.partner_types
FOR INSERT
WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY partner_types_update ON public.partner_types
FOR UPDATE
USING (public.get_user_role() = 'super_admin');

CREATE POLICY partner_types_delete ON public.partner_types
FOR DELETE
USING (public.get_user_role() = 'super_admin');

ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS partner_type_id UUID REFERENCES public.partner_types(id),
  ADD COLUMN IF NOT EXISTS type_data JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Seed types (backfill existing partners).
INSERT INTO public.partner_types (slug, name, default_tabs, type_data_schema)
VALUES
  (
    'club',
    'Club / Community Center',
    '[
      {"label":"About","slug":"about","order":0},
      {"label":"Events","slug":"events","order":1},
      {"label":"Membership","slug":"membership","order":2},
      {"label":"Hours & Contact","slug":"hours","order":3}
    ]'::jsonb,
    '{
      "description": "Club members, membership plans, and event-oriented content.",
      "fields": []
    }'::jsonb
  ),
  (
    'salon',
    'Salon / Service Business',
    '[
      {"label":"About","slug":"about","order":0},
      {"label":"Services","slug":"services","order":1},
      {"label":"Book Appointment","slug":"book","order":2},
      {"label":"Hours & Contact","slug":"hours","order":3}
    ]'::jsonb,
    '{
      "description": "Service menu, booking details, and operational hours.",
      "fields": []
    }'::jsonb
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  default_tabs = EXCLUDED.default_tabs,
  type_data_schema = EXCLUDED.type_data_schema;

-- Backfill existing partners.
UPDATE public.partners
SET partner_type_id = (
  SELECT pt.id FROM public.partner_types pt WHERE pt.slug = 'club'
)
WHERE slug = 'the-horn';

UPDATE public.partners
SET partner_type_id = (
  SELECT pt.id FROM public.partner_types pt WHERE pt.slug = 'salon'
)
WHERE slug = 'the-mane';

COMMIT;

