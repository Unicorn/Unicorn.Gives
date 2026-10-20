-- ============================================================================
-- 062: The Horn's hero button goes to the in-app membership tab
--
-- Migrations 024/025 pointed "Join the Community" at an external Square link
-- (square.link/u/liQwjPlT) sold before memberships moved in-app. 061 replaced
-- that link everywhere else; this retires it from the hero too.
--
-- Idempotent: only rewrites the old external link, so a URL an admin has set
-- since is left alone.
-- ============================================================================

update public.partner_landing_pages lp
set hero_cta_url = '/partners/the-horn/membership',
    updated_at = now()
from public.partners p
where p.id = lp.partner_id
  and p.slug = 'the-horn'
  and lp.hero_cta_url like 'https://square.link/%';
