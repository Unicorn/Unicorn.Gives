-- =============================================================================
-- Facilities — parks, buildings, fields, pools, and other public venues
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.facilities (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id         UUID NOT NULL REFERENCES public.regions(id),
  slug              TEXT NOT NULL,
  name              TEXT NOT NULL,
  description       TEXT,
  body              TEXT,
  facility_type     TEXT NOT NULL DEFAULT 'building'
                      CHECK (facility_type IN (
                        'park', 'building', 'field', 'pavilion', 'trail',
                        'pool', 'cemetery', 'airport', 'other'
                      )),
  department_id     UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  address           TEXT,
  latitude          NUMERIC(10,8),
  longitude         NUMERIC(11,8),
  map_url           TEXT,
  hours             TEXT,
  seasonal_dates    TEXT,
  amenities         JSONB DEFAULT '[]',
  rental_available  BOOLEAN DEFAULT false,
  rental_rates      TEXT,
  rental_form_url   TEXT,
  rules_url         TEXT,
  hero_image_url    TEXT,
  gallery_urls      JSONB DEFAULT '[]',
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
CREATE INDEX IF NOT EXISTS idx_facilities_region
  ON public.facilities(region_id);
CREATE INDEX IF NOT EXISTS idx_facilities_status
  ON public.facilities(status);
CREATE INDEX IF NOT EXISTS idx_facilities_department
  ON public.facilities(department_id) WHERE department_id IS NOT NULL;

CREATE TRIGGER trg_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — region-scoped
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY facilities_select ON public.facilities FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY facilities_insert ON public.facilities FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY facilities_update ON public.facilities FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY facilities_delete ON public.facilities FOR DELETE
  USING (public.get_user_role() = 'super_admin');
