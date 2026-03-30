-- =============================================================================
-- Categories & Tags — managed lookup tables
-- =============================================================================

-- 1. Categories table
-- =============================================================================

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL
    CHECK (content_type IN ('events', 'news', 'guides', 'ordinances')),
  slug TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  color TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(content_type, slug)
);

-- 2. Tags table
-- =============================================================================

CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Seed categories from existing hardcoded values
-- =============================================================================

-- Events
INSERT INTO public.categories (content_type, slug, label, display_order) VALUES
  ('events', 'government',    'Government',    0),
  ('events', 'community',     'Community',     1),
  ('events', 'conservation',  'Conservation',  2),
  ('events', 'seniors',       'Seniors',       3),
  ('events', 'horn',          'Horn',          4),
  ('events', 'unicorn-gives', 'Unicorn Gives', 5),
  ('events', 'the-mane',      'The Mane',      6);

-- News
INSERT INTO public.categories (content_type, slug, label, display_order) VALUES
  ('news', 'ordinance-change',  'Ordinance Change',  0),
  ('news', 'government-action', 'Government Action', 1),
  ('news', 'public-safety',     'Public Safety',     2),
  ('news', 'public-notice',     'Public Notice',     3),
  ('news', 'community',         'Community',         4),
  ('news', 'infrastructure',    'Infrastructure',    5),
  ('news', 'election',          'Election',          6);

-- Guides
INSERT INTO public.categories (content_type, slug, label, display_order) VALUES
  ('guides', 'property',   'Property & Building',   0),
  ('guides', 'taxes',      'Taxes & Assessment',    1),
  ('guides', 'safety',     'Public Safety',         2),
  ('guides', 'nature',     'Nature & Conservation', 3),
  ('guides', 'government', 'Government',            4),
  ('guides', 'services',   'Community Services',    5),
  ('guides', 'records',    'Records',               6);

-- Ordinances
INSERT INTO public.categories (content_type, slug, label, display_order) VALUES
  ('ordinances', 'zoning',         'Zoning',         0),
  ('ordinances', 'public-safety',  'Public Safety',  1),
  ('ordinances', 'environment',    'Environment',    2),
  ('ordinances', 'property',       'Property',       3),
  ('ordinances', 'infrastructure', 'Infrastructure', 4),
  ('ordinances', 'general',        'General',        5);

-- 4. Seed tags from existing event tags
-- =============================================================================

INSERT INTO public.tags (slug, label)
SELECT DISTINCT unnest(tags) AS slug, initcap(replace(unnest(tags), '-', ' ')) AS label
FROM public.events
WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
ON CONFLICT (slug) DO NOTHING;

-- 5. Drop CHECK constraints on category columns
-- =============================================================================

-- Events: drop the inline check on category
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_category_check;

-- News: drop the inline check on category
ALTER TABLE public.news DROP CONSTRAINT IF EXISTS news_category_check;

-- Guides: drop the inline check on category
ALTER TABLE public.guides DROP CONSTRAINT IF EXISTS guides_category_check;

-- Ordinances: drop the inline check on category
ALTER TABLE public.ordinances DROP CONSTRAINT IF EXISTS ordinances_category_check;

-- 6. RLS — publicly readable, admin-writable (same pattern as regions/partners)
-- =============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Categories
CREATE POLICY categories_select ON public.categories FOR SELECT USING (true);
CREATE POLICY categories_insert ON public.categories FOR INSERT
  WITH CHECK (public.get_user_role() = 'super_admin');
CREATE POLICY categories_update ON public.categories FOR UPDATE
  USING (public.get_user_role() = 'super_admin');
CREATE POLICY categories_delete ON public.categories FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Tags
CREATE POLICY tags_select ON public.tags FOR SELECT USING (true);
CREATE POLICY tags_insert ON public.tags FOR INSERT
  WITH CHECK (public.get_user_role() = 'super_admin');
CREATE POLICY tags_update ON public.tags FOR UPDATE
  USING (public.get_user_role() = 'super_admin');
CREATE POLICY tags_delete ON public.tags FOR DELETE
  USING (public.get_user_role() = 'super_admin');
