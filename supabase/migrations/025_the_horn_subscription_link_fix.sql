-- ============================================================================
-- 025: The Horn subscription link — regex-based rewrite
-- 024 used literal replace() which missed variants like a trailing slash on
-- the URL. This uses regexp_replace to catch all horn.love references inside
-- The Horn's partner_pages markdown.
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

  -- Replace any markdown link whose target is horn.love (with or without
  -- scheme, trailing slash, path, or query) with a Square signup link.
  -- Pattern: [label](https?://horn.love…)
  update partner_pages
  set body = regexp_replace(
        body,
        '\[([^\]]+)\]\(https?://horn\.love[^\)]*\)',
        '[Sign Up Now](' || square_url || ')',
        'g'
      )
  where partner_id = horn_id
    and body ~ 'horn\.love';

  -- Catch bare horn.love mentions outside markdown links too.
  update partner_pages
  set body = regexp_replace(
        body,
        '\bhorn\.love\b',
        'square.link/u/liQwjPlT',
        'g'
      )
  where partner_id = horn_id
    and body ~ 'horn\.love';

  -- Landing page CTA (if any).
  update partner_landing_pages
  set hero_cta_url = square_url,
      updated_at   = now()
  where partner_id = horn_id
    and hero_cta_url ilike '%horn.love%';
end $$;
