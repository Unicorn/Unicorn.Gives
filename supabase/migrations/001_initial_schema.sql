-- =============================================================================
-- Unicorn.Gives — Initial Schema Migration
-- =============================================================================

-- 1.0 Foundation: Regions & Partners
-- =============================================================================

CREATE TABLE public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('county', 'township', 'city', 'village')),
  parent_id UUID REFERENCES public.regions(id),
  description TEXT,
  website TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  region_id UUID REFERENCES public.regions(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  tabs JSONB,
  theme_overrides JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.1 Auth & ACL
-- =============================================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'public'
    CHECK (role IN ('super_admin', 'municipal_editor', 'partner_editor', 'community_contributor', 'public')),
  region_ids UUID[],
  partner_id UUID REFERENCES public.partners(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'publish')),
  conditions JSONB,
  UNIQUE(role, resource, action)
);

CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.2 Region-Scoped Content
-- =============================================================================

CREATE TABLE public.minutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES public.regions(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  meeting_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('approved', 'pending', 'draft')),
  source TEXT DEFAULT 'transcribed'
    CHECK (source IN ('transcribed', 'pdf', 'original-html')),
  body TEXT NOT NULL,
  pdf_url TEXT,
  attendees_present TEXT[],
  attendees_absent TEXT[],
  attendees_also_present TEXT[],
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  UNIQUE(region_id, slug)
);

CREATE TABLE public.ordinances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES public.regions(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  number INT,
  description TEXT,
  body TEXT,
  category TEXT NOT NULL
    CHECK (category IN ('zoning', 'public-safety', 'environment', 'property', 'infrastructure', 'general')),
  adopted_date DATE,
  amended_date DATE,
  pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  UNIQUE(region_id, slug)
);

CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES public.regions(id),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT,
  phone_ext TEXT,
  email TEXT,
  address TEXT,
  hours TEXT,
  website TEXT,
  display_order INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(region_id, slug)
);

CREATE TABLE public.elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES public.regions(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  body TEXT,
  election_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('general', 'primary', 'special', 'local')),
  registration_deadline DATE,
  absentee_deadline DATE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  UNIQUE(region_id, slug)
);

CREATE TABLE public.region_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES public.regions(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  body TEXT NOT NULL,
  category TEXT,
  display_order INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  UNIQUE(region_id, slug)
);

-- 1.3 Partner-Scoped Content
-- =============================================================================

CREATE TABLE public.partner_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tab_slug TEXT,
  display_order INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  UNIQUE(partner_id, slug)
);

-- 1.4 Global Content (with optional region/partner scoping)
-- =============================================================================

CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  body TEXT NOT NULL,
  date DATE NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT,
  category TEXT NOT NULL
    CHECK (category IN (
      'ordinance-change', 'government-action', 'public-safety',
      'public-notice', 'community', 'infrastructure', 'election'
    )),
  region_id UUID REFERENCES public.regions(id),
  partner_id UUID REFERENCES public.partners(id),
  visibility TEXT NOT NULL DEFAULT 'global'
    CHECK (visibility IN ('global', 'scoped', 'both')),
  source TEXT,
  source_url TEXT,
  featured BOOLEAN DEFAULT false,
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')),
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  body TEXT,
  date DATE NOT NULL,
  end_date DATE,
  time TEXT,
  location TEXT,
  category TEXT NOT NULL
    CHECK (category IN (
      'government', 'community', 'conservation',
      'seniors', 'horn', 'unicorn-gives', 'the-mane'
    )),
  region_id UUID REFERENCES public.regions(id),
  partner_id UUID REFERENCES public.partners(id),
  visibility TEXT NOT NULL DEFAULT 'global'
    CHECK (visibility IN ('global', 'scoped', 'both')),
  recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  registration_url TEXT,
  cost TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE TABLE public.guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  body TEXT NOT NULL,
  category TEXT NOT NULL
    CHECK (category IN ('property', 'taxes', 'safety', 'nature', 'government', 'services', 'records')),
  scenario TEXT NOT NULL,
  icon TEXT,
  jurisdiction TEXT CHECK (jurisdiction IN ('township', 'county', 'state', 'federal')),
  related_guide_ids UUID[],
  last_verified DATE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE TABLE public.guide_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  email TEXT,
  display_order INT DEFAULT 0
);

CREATE TABLE public.guide_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  format TEXT DEFAULT 'PDF',
  display_order INT DEFAULT 0
);

CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  body TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  nav_title TEXT,
  hide_from_nav BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES public.profiles(id),
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- 1.5 User-Facing Feature Tables
-- =============================================================================

CREATE TABLE public.notification_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  region_id UUID REFERENCES public.regions(id),
  partner_id UUID REFERENCES public.partners(id),
  channel TEXT NOT NULL DEFAULT 'push'
    CHECK (channel IN ('push', 'email')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic, channel, region_id, partner_id)
);

CREATE TABLE public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'going'
    CHECK (status IN ('going', 'interested', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

CREATE TABLE public.foia_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  region_id UUID NOT NULL REFERENCES public.regions(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'acknowledged', 'in_progress', 'completed', 'denied')),
  response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_type, resource_id)
);

-- 1.6 Navigation & Site Config
-- =============================================================================

CREATE TABLE public.navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.navigation(id),
  label TEXT NOT NULL,
  path TEXT,
  icon TEXT,
  pillar TEXT CHECK (pillar IN ('solve', 'govern', 'inform', 'connect')),
  region_id UUID REFERENCES public.regions(id),
  partner_id UUID REFERENCES public.partners(id),
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  badge_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- Regions & partners
CREATE INDEX idx_regions_parent ON public.regions(parent_id);
CREATE INDEX idx_regions_type ON public.regions(type);
CREATE INDEX idx_partners_region ON public.partners(region_id);

-- Region-scoped content
CREATE INDEX idx_minutes_region_date ON public.minutes(region_id, date DESC);
CREATE INDEX idx_minutes_type ON public.minutes(meeting_type);
CREATE INDEX idx_ordinances_region_cat ON public.ordinances(region_id, category);
CREATE INDEX idx_contacts_region ON public.contacts(region_id);
CREATE INDEX idx_contacts_dept ON public.contacts(department);
CREATE INDEX idx_elections_region ON public.elections(region_id, election_date DESC);
CREATE INDEX idx_region_pages_region ON public.region_pages(region_id);

-- Partner content
CREATE INDEX idx_partner_pages_partner ON public.partner_pages(partner_id);

-- Global content with scoping
CREATE INDEX idx_news_date ON public.news(date DESC);
CREATE INDEX idx_news_region ON public.news(region_id) WHERE region_id IS NOT NULL;
CREATE INDEX idx_news_partner ON public.news(partner_id) WHERE partner_id IS NOT NULL;
CREATE INDEX idx_news_featured ON public.news(featured) WHERE featured = true;
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_region ON public.events(region_id) WHERE region_id IS NOT NULL;
CREATE INDEX idx_events_partner ON public.events(partner_id) WHERE partner_id IS NOT NULL;
CREATE INDEX idx_guides_category ON public.guides(category);
CREATE INDEX idx_pages_slug ON public.pages(slug);

-- Full-text search
CREATE INDEX idx_minutes_fts ON public.minutes USING GIN (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))
);
CREATE INDEX idx_guides_fts ON public.guides USING GIN (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(scenario, '') || ' ' || coalesce(body, ''))
);
CREATE INDEX idx_pages_fts ON public.pages USING GIN (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))
);

-- User features
CREATE INDEX idx_subscriptions_user ON public.notification_subscriptions(user_id);
CREATE INDEX idx_rsvps_event ON public.event_rsvps(event_id);
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_audit_resource ON public.audit_log(resource_type, resource_id);

-- =============================================================================
-- Auto-admin trigger: @unicorn.love emails get super_admin role
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN NEW.email LIKE '%@unicorn.love' THEN 'super_admin'
      ELSE 'public'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- Row-Level Security (RLS)
-- =============================================================================

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to get current user's region_ids
CREATE OR REPLACE FUNCTION public.get_user_region_ids()
RETURNS UUID[] AS $$
  SELECT COALESCE(region_ids, '{}') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to get current user's partner_id
CREATE OR REPLACE FUNCTION public.get_user_partner_id()
RETURNS UUID AS $$
  SELECT partner_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordinances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.region_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foia_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own, admins can read all
CREATE POLICY profiles_select ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.get_user_role() = 'super_admin');

CREATE POLICY profiles_update ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.get_user_role() = 'super_admin');

CREATE POLICY profiles_insert ON public.profiles FOR INSERT
  WITH CHECK (true); -- handled by trigger

-- Regions & Partners: publicly readable, admin-writable
CREATE POLICY regions_select ON public.regions FOR SELECT USING (true);
CREATE POLICY regions_insert ON public.regions FOR INSERT
  WITH CHECK (public.get_user_role() = 'super_admin');
CREATE POLICY regions_update ON public.regions FOR UPDATE
  USING (public.get_user_role() = 'super_admin');
CREATE POLICY regions_delete ON public.regions FOR DELETE
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY partners_select ON public.partners FOR SELECT USING (true);
CREATE POLICY partners_insert ON public.partners FOR INSERT
  WITH CHECK (public.get_user_role() = 'super_admin');
CREATE POLICY partners_update ON public.partners FOR UPDATE
  USING (public.get_user_role() = 'super_admin');
CREATE POLICY partners_delete ON public.partners FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Region-scoped content: published is public, editors can see their region's drafts
-- Pattern: minutes, ordinances, contacts, elections, region_pages

-- Minutes
CREATE POLICY minutes_select ON public.minutes FOR SELECT
  USING (
    status IN ('approved', 'pending')
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY minutes_insert ON public.minutes FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY minutes_update ON public.minutes FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY minutes_delete ON public.minutes FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Ordinances
CREATE POLICY ordinances_select ON public.ordinances FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY ordinances_insert ON public.ordinances FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY ordinances_update ON public.ordinances FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY ordinances_delete ON public.ordinances FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Contacts
CREATE POLICY contacts_select ON public.contacts FOR SELECT
  USING (
    status = 'published'
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY contacts_insert ON public.contacts FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY contacts_update ON public.contacts FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY contacts_delete ON public.contacts FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Elections
CREATE POLICY elections_select ON public.elections FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY elections_insert ON public.elections FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY elections_update ON public.elections FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY elections_delete ON public.elections FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Region Pages
CREATE POLICY region_pages_select ON public.region_pages FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY region_pages_insert ON public.region_pages FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY region_pages_update ON public.region_pages FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY region_pages_delete ON public.region_pages FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Partner Pages
CREATE POLICY partner_pages_select ON public.partner_pages FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

CREATE POLICY partner_pages_insert ON public.partner_pages FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

CREATE POLICY partner_pages_update ON public.partner_pages FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

CREATE POLICY partner_pages_delete ON public.partner_pages FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- News: published is public, contributors can see own drafts
CREATE POLICY news_select ON public.news FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND (region_id IS NULL OR region_id = ANY(public.get_user_region_ids())))
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

CREATE POLICY news_insert ON public.news FOR INSERT
  WITH CHECK (
    public.get_user_role() IN ('super_admin', 'municipal_editor', 'partner_editor', 'community_contributor')
  );

CREATE POLICY news_update ON public.news FOR UPDATE
  USING (
    auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND (region_id IS NULL OR region_id = ANY(public.get_user_region_ids())))
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

CREATE POLICY news_delete ON public.news FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Events: same pattern as news
CREATE POLICY events_select ON public.events FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND (region_id IS NULL OR region_id = ANY(public.get_user_region_ids())))
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

CREATE POLICY events_insert ON public.events FOR INSERT
  WITH CHECK (
    public.get_user_role() IN ('super_admin', 'municipal_editor', 'partner_editor', 'community_contributor')
  );

CREATE POLICY events_update ON public.events FOR UPDATE
  USING (
    auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor' AND (region_id IS NULL OR region_id = ANY(public.get_user_region_ids())))
    OR (public.get_user_role() = 'partner_editor' AND partner_id = public.get_user_partner_id())
  );

CREATE POLICY events_delete ON public.events FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Guides: published is public, editors can manage
CREATE POLICY guides_select ON public.guides FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() IN ('super_admin', 'municipal_editor')
  );

CREATE POLICY guides_insert ON public.guides FOR INSERT
  WITH CHECK (
    public.get_user_role() IN ('super_admin', 'municipal_editor', 'community_contributor')
  );

CREATE POLICY guides_update ON public.guides FOR UPDATE
  USING (
    auth.uid() = author_id
    OR public.get_user_role() IN ('super_admin', 'municipal_editor')
  );

CREATE POLICY guides_delete ON public.guides FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Guide contacts/forms: follow parent guide access
CREATE POLICY guide_contacts_select ON public.guide_contacts FOR SELECT USING (true);
CREATE POLICY guide_contacts_insert ON public.guide_contacts FOR INSERT
  WITH CHECK (public.get_user_role() IN ('super_admin', 'municipal_editor', 'community_contributor'));
CREATE POLICY guide_contacts_update ON public.guide_contacts FOR UPDATE
  USING (public.get_user_role() IN ('super_admin', 'municipal_editor'));
CREATE POLICY guide_contacts_delete ON public.guide_contacts FOR DELETE
  USING (public.get_user_role() IN ('super_admin', 'municipal_editor'));

CREATE POLICY guide_forms_select ON public.guide_forms FOR SELECT USING (true);
CREATE POLICY guide_forms_insert ON public.guide_forms FOR INSERT
  WITH CHECK (public.get_user_role() IN ('super_admin', 'municipal_editor', 'community_contributor'));
CREATE POLICY guide_forms_update ON public.guide_forms FOR UPDATE
  USING (public.get_user_role() IN ('super_admin', 'municipal_editor'));
CREATE POLICY guide_forms_delete ON public.guide_forms FOR DELETE
  USING (public.get_user_role() IN ('super_admin', 'municipal_editor'));

-- Global Pages
CREATE POLICY pages_select ON public.pages FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id OR public.get_user_role() = 'super_admin');

CREATE POLICY pages_insert ON public.pages FOR INSERT
  WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY pages_update ON public.pages FOR UPDATE
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY pages_delete ON public.pages FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Navigation: publicly readable, admin-writable
CREATE POLICY navigation_select ON public.navigation FOR SELECT USING (true);
CREATE POLICY navigation_manage ON public.navigation FOR ALL
  USING (public.get_user_role() = 'super_admin');

-- Site settings: publicly readable, admin-writable
CREATE POLICY site_settings_select ON public.site_settings FOR SELECT USING (true);
CREATE POLICY site_settings_manage ON public.site_settings FOR ALL
  USING (public.get_user_role() = 'super_admin');

-- Audit log: admins and scoped editors can read
CREATE POLICY audit_log_select ON public.audit_log FOR SELECT
  USING (public.get_user_role() IN ('super_admin', 'municipal_editor', 'partner_editor'));
CREATE POLICY audit_log_insert ON public.audit_log FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- User feature tables: own data only
CREATE POLICY subscriptions_select ON public.notification_subscriptions FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY subscriptions_insert ON public.notification_subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY subscriptions_delete ON public.notification_subscriptions FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY rsvps_select ON public.event_rsvps FOR SELECT
  USING (user_id = auth.uid() OR public.get_user_role() = 'super_admin');
CREATE POLICY rsvps_insert ON public.event_rsvps FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY rsvps_update ON public.event_rsvps FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY rsvps_delete ON public.event_rsvps FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY foia_select ON public.foia_requests FOR SELECT
  USING (user_id = auth.uid() OR public.get_user_role() IN ('super_admin', 'municipal_editor'));
CREATE POLICY foia_insert ON public.foia_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY foia_update ON public.foia_requests FOR UPDATE
  USING (public.get_user_role() IN ('super_admin', 'municipal_editor'));

CREATE POLICY bookmarks_select ON public.bookmarks FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY bookmarks_insert ON public.bookmarks FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY bookmarks_delete ON public.bookmarks FOR DELETE
  USING (user_id = auth.uid());

-- =============================================================================
-- Seed Data: Initial regions and partners
-- =============================================================================

INSERT INTO public.regions (slug, name, type, description, display_order) VALUES
  ('clare-county', 'Clare County', 'county', 'Clare County, Michigan', 0);

INSERT INTO public.regions (slug, name, type, parent_id, description, display_order) VALUES
  ('lincoln-township', 'Lincoln Township', 'township',
    (SELECT id FROM public.regions WHERE slug = 'clare-county'),
    'Lincoln Township, Clare County, Michigan', 1);

INSERT INTO public.partners (slug, name, description, region_id, tabs) VALUES
  ('the-horn', 'The Horn', 'Community center serving Lincoln Township and surrounding areas',
    (SELECT id FROM public.regions WHERE slug = 'lincoln-township'),
    '[{"label": "About", "slug": "about", "order": 0}, {"label": "Events", "slug": "events", "order": 1}, {"label": "Membership", "slug": "membership", "order": 2}, {"label": "Hours & Contact", "slug": "hours-horn", "order": 3}]'::jsonb),
  ('the-mane', 'The Mane', 'Salon and community space',
    (SELECT id FROM public.regions WHERE slug = 'lincoln-township'),
    '[{"label": "About", "slug": "about", "order": 0}, {"label": "Services", "slug": "services", "order": 1}, {"label": "Book Appointment", "slug": "book", "order": 2}, {"label": "Hours & Contact", "slug": "hours", "order": 3}]'::jsonb);
