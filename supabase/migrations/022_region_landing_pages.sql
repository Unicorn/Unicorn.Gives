-- =============================================================================
-- 022: Region Landing Pages + Newsletter Subscribers
-- =============================================================================
-- Structured landing-page builder for regions (townships, cities, villages,
-- county), mirroring partner_landing_pages. One landing page per region.
-- Also adds a minimal newsletter_subscribers table for email capture.

-- 1. region_landing_pages
-- =============================================================================

CREATE TABLE public.region_landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES public.regions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),

  -- Hero section
  hero_eyebrow TEXT,
  hero_headline TEXT,
  hero_headline_accent TEXT,           -- italic accent phrase (e.g. "Growing Together.")
  hero_subheadline TEXT,
  hero_image_url TEXT,
  hero_cta_primary_label TEXT,
  hero_cta_primary_url TEXT,
  hero_cta_secondary_label TEXT,
  hero_cta_secondary_url TEXT,

  -- About / intro
  about_title TEXT,
  about_body TEXT,
  about_image_url TEXT,

  -- Quick access bento
  -- [{ key, icon, title, description, href, color_scheme? }]
  quick_access JSONB DEFAULT '[]'::jsonb,
  quick_access_title TEXT,
  quick_access_subtitle TEXT,

  -- News feed settings
  -- { enabled, title, subtitle, auto_limit, featured_news_ids[], show_view_all, category_slugs[] }
  news_settings JSONB DEFAULT '{"enabled":true,"auto_limit":4,"show_view_all":true}'::jsonb,

  -- Events feed settings
  -- { enabled, title, subtitle, auto_limit, include_parent_region, exclude_parent_categories[], show_view_all, category_slugs[] }
  events_settings JSONB DEFAULT '{"enabled":true,"auto_limit":4,"include_parent_region":true,"exclude_parent_categories":["government"],"show_view_all":true}'::jsonb,

  -- Custom markdown / gallery / quote / cta sections
  -- [{ type: 'markdown'|'gallery'|'quote'|'cta', title?, body?, image_url?, images?, quote?, author?, cta_label?, cta_url? }]
  custom_sections JSONB DEFAULT '[]'::jsonb,

  -- Newsletter CTA
  -- { enabled, title, body, placeholder, submit_label }
  newsletter JSONB DEFAULT '{"enabled":false,"title":"Stay Connected","body":"Sign up for community updates.","placeholder":"Email address","submit_label":"Subscribe"}'::jsonb,

  -- Layout
  section_order JSONB DEFAULT '["hero","quick_access","about","news","events","custom","newsletter"]'::jsonb,
  hidden_sections JSONB DEFAULT '[]'::jsonb,

  -- Meta
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,

  UNIQUE(region_id)
);

CREATE INDEX idx_region_landing_pages_region ON public.region_landing_pages(region_id);
CREATE INDEX idx_region_landing_pages_status ON public.region_landing_pages(status);

-- 2. RLS
-- =============================================================================

ALTER TABLE public.region_landing_pages ENABLE ROW LEVEL SECURITY;

-- Public can read published landing pages; admins can read all
CREATE POLICY region_landing_pages_select ON public.region_landing_pages FOR SELECT
  USING (
    status = 'published'
    OR public.get_user_role() = 'super_admin'
    OR public.get_user_role() = 'region_editor'
  );

CREATE POLICY region_landing_pages_insert ON public.region_landing_pages FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR public.get_user_role() = 'region_editor'
  );

CREATE POLICY region_landing_pages_update ON public.region_landing_pages FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR public.get_user_role() = 'region_editor'
  );

CREATE POLICY region_landing_pages_delete ON public.region_landing_pages FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- 3. updated_at trigger
-- =============================================================================

CREATE TRIGGER region_landing_pages_updated_at
  BEFORE UPDATE ON public.region_landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 4. Extend categories.content_type to allow taxonomy management for region
--    landing pages to reuse existing admin UI. This keeps a single dynamic
--    taxonomy system (already admin-only via the categories admin page).
-- =============================================================================

-- No schema change needed — categories already has content_type IN
-- ('events','news','guides','ordinances'). The landing page news/events
-- sections read category_slugs that resolve against the existing categories
-- table for labels/colors.

-- 5. newsletter_subscribers (email capture only; wiring to a provider TBD)
-- =============================================================================

CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  source TEXT,                          -- e.g. 'region_landing_page'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(email, region_id)
);

CREATE INDEX idx_newsletter_subscribers_region ON public.newsletter_subscribers(region_id);
CREATE INDEX idx_newsletter_subscribers_created_at ON public.newsletter_subscribers(created_at DESC);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert only)
CREATE POLICY newsletter_subscribers_insert ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Only admins can read the list
CREATE POLICY newsletter_subscribers_select ON public.newsletter_subscribers FOR SELECT
  USING (
    public.get_user_role() = 'super_admin'
    OR public.get_user_role() = 'region_editor'
  );

CREATE POLICY newsletter_subscribers_delete ON public.newsletter_subscribers FOR DELETE
  USING (public.get_user_role() = 'super_admin');
