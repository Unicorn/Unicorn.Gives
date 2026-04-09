-- ============================================================================
-- 021: Update The Horn's subscription sign-up link
-- Replaces every `https://horn.love` reference on The Horn's partner pages
-- with the Square-hosted signup link. Scoped to The Horn only — does not
-- touch community-home widgets or shared content_pages.
-- ============================================================================

do $$
declare
  horn_id uuid;
  square_url text := 'https://square.link/u/liQwjPlT';
begin
  select id into horn_id from partners where slug = 'the-horn';
  if horn_id is null then
    return;
  end if;

  update partner_pages
  set body = replace(
        replace(body, '[Sign Up at horn.love](https://horn.love)', '[Sign Up Now](' || square_url || ')'),
        '[horn.love](https://horn.love)',
        '[Sign Up Now](' || square_url || ')'
      )
  where partner_id = horn_id
    and body like '%horn.love%';

  -- Also update any landing page CTA that still points at horn.love.
  update partner_landing_pages
  set hero_cta_label = coalesce(nullif(hero_cta_label, ''), 'Join the Community'),
      hero_cta_url   = square_url,
      updated_at     = now()
  where partner_id = horn_id
    and (hero_cta_url is null or hero_cta_url ilike '%horn.love%');
end $$;
