-- Add parent_slug and attachments columns to region_pages for hierarchical resource pages
ALTER TABLE public.region_pages
  ADD COLUMN IF NOT EXISTS parent_slug TEXT,
  ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';

-- Index for efficient child-page lookups
CREATE INDEX IF NOT EXISTS idx_region_pages_parent_slug
  ON public.region_pages(region_id, parent_slug)
  WHERE parent_slug IS NOT NULL;

-- Index for category-based queries
CREATE INDEX IF NOT EXISTS idx_region_pages_category
  ON public.region_pages(region_id, category)
  WHERE category IS NOT NULL;

-- =============================================================================
-- Seed Lincoln Township resource pages
-- =============================================================================

-- Resources landing page
INSERT INTO public.region_pages (region_id, slug, title, description, body, category, parent_slug, display_order, status, published_at)
VALUES (
  (SELECT id FROM public.regions WHERE slug = 'lincoln-township'),
  'resources',
  'Resources',
  'Planning, zoning, and community resources for Lincoln Township.',
  '<p>Access Lincoln Township planning documents, zoning ordinances, recreation plans, and other community resources below.</p>',
  'resources',
  NULL,
  0,
  'published',
  now()
)
ON CONFLICT (region_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  body = EXCLUDED.body,
  category = EXCLUDED.category,
  parent_slug = EXCLUDED.parent_slug,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- Master Plan 2040
INSERT INTO public.region_pages (region_id, slug, title, description, body, category, parent_slug, attachments, display_order, status, published_at)
VALUES (
  (SELECT id FROM public.regions WHERE slug = 'lincoln-township'),
  'master-plan',
  'Master Plan 2040',
  'Adopted March 12, 2024 by the Planning Commission',
  '<h2>Lincoln Township Master Plan 2040</h2>
<p>The Master Plan provides a long-range guide for growth, land use, and community development in Lincoln Township. Adopted on March 12, 2024 by the Planning Commission, this plan addresses housing, transportation, natural resources, and community facilities.</p>
<h3>Key Focus Areas</h3>
<ul>
<li>Future land use and zoning alignment</li>
<li>Housing and residential development</li>
<li>Transportation and infrastructure</li>
<li>Natural resources and recreation</li>
<li>Community facilities and services</li>
</ul>
<h3>Community Profile</h3>
<ul>
<li>Population: 1,805 residents (2020 Census)</li>
<li>Total area: 22,967 acres (35.9 sq mi)</li>
<li>Woodland coverage: 82.5% of township</li>
<li>Housing: 86.2% single-family, 56.2% vacant/seasonal</li>
</ul>',
  'resources',
  'resources',
  '[{"label":"Master Plan 2040 (PDF, 11.3 MB)","url":"https://kifhbevwmpqdeuxqnjxa.supabase.co/storage/v1/object/public/media/municipal-documents/master-plan-2040.pdf","mime_type":"application/pdf","size_label":"11.3 MB"}]'::jsonb,
  1,
  'published',
  now()
)
ON CONFLICT (region_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  body = EXCLUDED.body,
  category = EXCLUDED.category,
  parent_slug = EXCLUDED.parent_slug,
  attachments = EXCLUDED.attachments,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- Recreation Plan 2026-2030
INSERT INTO public.region_pages (region_id, slug, title, description, body, category, parent_slug, attachments, display_order, status, published_at)
VALUES (
  (SELECT id FROM public.regions WHERE slug = 'lincoln-township'),
  'recreation-plan',
  'Recreation Plan 2026–2030',
  'Adopted January 12, 2026 by the Board of Trustees',
  '<h2>Recreation Plan 2026–2030</h2>
<p>This five-year recreation plan outlines goals and action items for parks, trails, and recreation facilities in Lincoln Township. Required for DNR grant eligibility through calendar year 2030.</p>
<h3>Highlights</h3>
<ul>
<li>Inventory of existing parks and recreation facilities</li>
<li>Community input and needs assessment</li>
<li>Goals, objectives, and action plan</li>
<li>Capital improvement schedule</li>
</ul>
<h3>Township Parks</h3>
<ul>
<li>Bertha Park</li>
<li>Shingle Lake Park</li>
<li>Silver Lake Park</li>
<li>Hamlin Field (20 acres)</li>
</ul>
<h3>Recommended Trail Projects</h3>
<ul>
<li>Shared Use Pathway: Lake George to White Birch Campground (~7 miles, highest priority)</li>
<li>Pedestrian/Bicycle Travel enhancements: crossings, signage, bike racks</li>
<li>Shared Use Pathway: Lake George to western Township border (~1.5 miles)</li>
</ul>',
  'resources',
  'resources',
  '[{"label":"Recreation Plan 2026-2030 (PDF, 4.2 MB)","url":"https://kifhbevwmpqdeuxqnjxa.supabase.co/storage/v1/object/public/media/municipal-documents/recreation-plan-2026-2030.pdf","mime_type":"application/pdf","size_label":"4.2 MB"}]'::jsonb,
  2,
  'published',
  now()
)
ON CONFLICT (region_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  body = EXCLUDED.body,
  category = EXCLUDED.category,
  parent_slug = EXCLUDED.parent_slug,
  attachments = EXCLUDED.attachments,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- Zoning Ordinance No. 44
INSERT INTO public.region_pages (region_id, slug, title, description, body, category, parent_slug, attachments, display_order, status, published_at)
VALUES (
  (SELECT id FROM public.regions WHERE slug = 'lincoln-township'),
  'zoning-ordinance',
  'Zoning Ordinance No. 44',
  'Amended November 14, 2023',
  '<h2>Zoning Ordinance No. 44</h2>
<p>The Zoning Ordinance regulates land use, lot sizes, setbacks, building heights, and permitted uses across all zoning districts in Lincoln Township. Originally adopted August 14, 2017; last amended April 1, 2022.</p>
<h3>Zoning Districts</h3>
<ul>
<li>Agricultural / Rural Residential (AR)</li>
<li>Low-Density Residential (R-1)</li>
<li>Medium-Density Residential (R-2)</li>
<li>Commercial (C-1)</li>
<li>Industrial (I-1)</li>
<li>Lake Residential Overlay (LR)</li>
<li>Planned Unit Development (PUD)</li>
</ul>
<h3>Permit Process</h3>
<ul>
<li>Zoning permits required before grading, excavation, or construction</li>
<li>Single-family/two-family: Zoning Administrator approval within 15 days</li>
<li>Other uses: Planning Commission review required (90-day timeline)</li>
<li>Special Land Uses require Planning Commission final action</li>
<li>Variances handled by the Zoning Board of Appeals (ZBA)</li>
</ul>
<h3>Key Regulations</h3>
<ul>
<li>Off-street parking and loading requirements by use type</li>
<li>Landscaping and screening standards with buffer zones</li>
<li>Environmental protection: natural resources, stormwater, shorelines</li>
<li>Sign standards and regulations by district</li>
<li>Nonconforming lots, structures, and uses provisions</li>
</ul>',
  'resources',
  'resources',
  '[{"label":"Zoning Ordinance No. 44 (PDF, 2.0 MB)","url":"https://kifhbevwmpqdeuxqnjxa.supabase.co/storage/v1/object/public/media/municipal-documents/zoning-ordinance-44.pdf","mime_type":"application/pdf","size_label":"2.0 MB"}]'::jsonb,
  3,
  'published',
  now()
)
ON CONFLICT (region_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  body = EXCLUDED.body,
  category = EXCLUDED.category,
  parent_slug = EXCLUDED.parent_slug,
  attachments = EXCLUDED.attachments,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;
