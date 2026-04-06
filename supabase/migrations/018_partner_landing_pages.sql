-- =============================================================================
-- 018: Partner Landing Pages & Custom Domain Support
-- =============================================================================
-- Adds structured landing page data for partners (hero, about, services, team,
-- testimonials, gallery, contact, custom sections) and a custom_domain field
-- on partners for domain redirect instructions.

-- 1. Create partner_landing_pages table
-- =============================================================================

CREATE TABLE public.partner_landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),

  -- Hero section
  hero_headline TEXT,
  hero_subheadline TEXT,
  hero_image_url TEXT,
  hero_cta_label TEXT,
  hero_cta_url TEXT,

  -- About section
  about_title TEXT,
  about_body TEXT,
  about_image_url TEXT,

  -- Structured JSONB arrays
  services JSONB DEFAULT '[]'::jsonb,        -- [{title, description, icon?, image_url?}]
  team_members JSONB DEFAULT '[]'::jsonb,    -- [{name, role, image_url?, bio?}]
  testimonials JSONB DEFAULT '[]'::jsonb,    -- [{quote, author, role?, image_url?}]
  gallery_images JSONB DEFAULT '[]'::jsonb,  -- [{url, caption?}]

  -- Contact section
  contact_phone TEXT,
  contact_email TEXT,
  contact_address TEXT,
  contact_hours TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,    -- {facebook?, instagram?, twitter?, website?}

  -- Layout control
  section_order JSONB DEFAULT '["hero","about","services","team","testimonials","gallery","contact"]'::jsonb,
  hidden_sections JSONB DEFAULT '[]'::jsonb,

  -- Custom markdown sections
  custom_sections JSONB DEFAULT '[]'::jsonb, -- [{title, body, image_url?}]

  -- Timestamps
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,

  -- One landing page per partner
  UNIQUE(partner_id)
);

CREATE INDEX idx_partner_landing_pages_partner ON public.partner_landing_pages(partner_id);

-- 2. Add custom_domain to partners
-- =============================================================================

ALTER TABLE public.partners ADD COLUMN custom_domain TEXT UNIQUE;

-- 3. Row-Level Security
-- =============================================================================

ALTER TABLE public.partner_landing_pages ENABLE ROW LEVEL SECURITY;

-- Public can read published landing pages
CREATE POLICY partner_landing_pages_select ON public.partner_landing_pages FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

-- Super admin and partner editors can insert
CREATE POLICY partner_landing_pages_insert ON public.partner_landing_pages FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

-- Super admin and partner editors can update
CREATE POLICY partner_landing_pages_update ON public.partner_landing_pages FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

-- Only super admin can delete
CREATE POLICY partner_landing_pages_delete ON public.partner_landing_pages FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- 4. Auto-update updated_at trigger
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partner_landing_pages_updated_at
  BEFORE UPDATE ON public.partner_landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
