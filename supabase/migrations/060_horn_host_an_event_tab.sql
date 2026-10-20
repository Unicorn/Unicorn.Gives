-- ============================================================================
-- 060: The Horn — "Host an event" tab
--
-- Adds a `host` tab (shown as "Host an event" in the partner menu bar) and its
-- page. The copy only restates what the membership page already offers
-- (member discounts on events, birthdays and gatherings) and points people to
-- public hours to ask in person — The Horn should review it and add rental
-- details/pricing before promoting it.
--
-- Idempotent: the tab is appended only if missing, the page only if absent.
-- ============================================================================

do $$
declare
  horn_id uuid;
begin
  select id into horn_id from public.partners where slug = 'the-horn';
  if horn_id is null then
    return;
  end if;

  update public.partners
  set tabs = coalesce(tabs, '[]'::jsonb) || jsonb_build_array(jsonb_build_object(
        'slug', 'host',
        'label', 'Host an Event',
        'order', coalesce((select max((t->>'order')::int) from jsonb_array_elements(tabs) t), -1) + 1
      ))
  where id = horn_id
    and not exists (
      select 1 from jsonb_array_elements(coalesce(tabs, '[]'::jsonb)) t where t->>'slug' = 'host'
    );

  insert into public.partner_pages (partner_id, slug, title, body, tab_slug, display_order, status, published_at)
  values (
    horn_id,
    'host-an-event',
    'Host an Event',
    '<h2>Host an Event at The Horn</h2>
<p>Celebrating a birthday, planning a get-together, or bringing a group together? The Horn is a welcoming space for gatherings of all kinds in the heart of Lake George.</p>
<h3>Members save</h3>
<p>Members enjoy discounted rates on events at The Horn — one more reason to join.</p>
<h3>Let''s plan it</h3>
<p>Stop by during public hours, <strong>10 AM – 2 PM daily</strong>, to see the space and talk through your event. You''ll find us at 304 Lake George St, Lake, MI 48632.</p>',
    'host',
    4,
    'published',
    now()
  )
  on conflict (partner_id, slug) do nothing;
end $$;
