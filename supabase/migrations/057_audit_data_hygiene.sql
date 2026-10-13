-- Audit 2026-10-13: data hygiene.

-- 1. Seeded news rows pointed at /images/news-*.jpg, which were never added to
--    public/. CloudFront masks the missing files as 200 HTML, so the cards showed
--    broken images silently. Clear them; real images can be set in the admin.
UPDATE public.news
SET image_url = NULL
WHERE image_url IN ('/images/news-community.jpg', '/images/news-building.jpg', '/images/news-forest.jpg');

-- 2. The Horn had Square bookings enabled against a copy of The Mane's catalog
--    (same variation IDs, synced 2026-04-06, no team members). Its location
--    returns NOT_FOUND for availability. The section is not in its layout today,
--    but enabling it would ship a dead booking flow. Keep it off until The Horn
--    has its own Square connection.
UPDATE public.square_feature_config
SET bookings_enabled = false
WHERE partner_id = 'edb9d068-74d5-4391-b919-29be35ba503f';
