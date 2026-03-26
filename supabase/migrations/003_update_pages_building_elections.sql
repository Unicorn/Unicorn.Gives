-- =============================================================================
-- Unicorn.Gives — building / elections pages (placeholder)
-- =============================================================================
-- Historical note:
--   This file previously contained large UPDATE statements for `public.pages`
--   slugs `building` and `elections`. That content is now covered by:
--     - `002_seed_content.sql` (generated from `content/` via generate-migration-sql)
--     - `004_upsert_pages_building_elections.sql` (INSERT ... ON CONFLICT for blank DBs)
--
-- This migration is intentionally a no-op so existing projects that already
-- applied an older version keep a stable filename/order; new installs skip the
-- old UPDATE body without losing data because 004 ensures the rows exist.
-- =============================================================================

SELECT 1;
