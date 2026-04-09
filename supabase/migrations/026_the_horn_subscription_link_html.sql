-- ============================================================================
-- 026: The Horn subscription link — HTML <a> variant
-- partner_pages.body is stored as rendered HTML, not markdown.
-- Rewrite every <a href="...horn.love..."> to the Square signup link.
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

  -- Replace the href attribute inside any anchor whose target is horn.love.
  update partner_pages
  set body = regexp_replace(
        body,
        'href="https?://horn\.love[^"]*"',
        'href="' || square_url || '"',
        'g'
      )
  where partner_id = horn_id
    and body ~* 'horn\.love';

  -- Replace the visible anchor text "horn.love" (and "Sign Up at horn.love")
  -- with "Sign Up Now" so the user sees the new action label.
  update partner_pages
  set body = regexp_replace(
        body,
        '>Sign Up at horn\.love<',
        '>Sign Up Now<',
        'g'
      )
  where partner_id = horn_id;

  update partner_pages
  set body = regexp_replace(
        body,
        '>horn\.love<',
        '>Sign Up Now<',
        'g'
      )
  where partner_id = horn_id;

  -- Any remaining bare mentions outside anchors → strip to friendly text.
  update partner_pages
  set body = regexp_replace(
        body,
        '\bhorn\.love\b',
        'square.link/u/liQwjPlT',
        'g'
      )
  where partner_id = horn_id
    and body ~* 'horn\.love';
end $$;
