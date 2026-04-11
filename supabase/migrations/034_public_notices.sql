-- =============================================================================
-- Public Notices — official notices, alerts, hearings, RFPs, and advisories
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.public_notices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id         UUID NOT NULL REFERENCES public.regions(id),
  slug              TEXT NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  body              TEXT,
  notice_type       TEXT NOT NULL DEFAULT 'general'
                      CHECK (notice_type IN (
                        'general', 'public_hearing', 'rfp', 'bid_request',
                        'emergency_alert', 'water_advisory', 'road_closure',
                        'election_notice'
                      )),
  severity          TEXT NOT NULL DEFAULT 'info'
                      CHECK (severity IN ('info', 'warning', 'urgent', 'emergency')),
  department_id     UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  publish_date      DATE,
  expiration_date   DATE,
  is_pinned         BOOLEAN DEFAULT false,
  attachment_url    TEXT,
  contact_name      TEXT,
  contact_phone     TEXT,
  contact_email     TEXT,
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published', 'archived')),
  author_id         UUID REFERENCES public.profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  published_at      TIMESTAMPTZ,
  UNIQUE(region_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_public_notices_region
  ON public.public_notices(region_id);
CREATE INDEX IF NOT EXISTS idx_public_notices_status
  ON public.public_notices(status);
CREATE INDEX IF NOT EXISTS idx_public_notices_department
  ON public.public_notices(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_public_notices_pinned
  ON public.public_notices(is_pinned) WHERE is_pinned = true;

CREATE TRIGGER trg_public_notices_updated_at
  BEFORE UPDATE ON public.public_notices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — region-scoped
ALTER TABLE public.public_notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_notices_select ON public.public_notices FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY public_notices_insert ON public.public_notices FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY public_notices_update ON public.public_notices FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY public_notices_delete ON public.public_notices FOR DELETE
  USING (public.get_user_role() = 'super_admin');
