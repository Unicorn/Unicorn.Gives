-- ============================================================================
-- 065: Fixed membership tiers (The Horn)
--
-- The Horn moves from pay-what-you-can to three monthly tiers — Individual
-- $50, Couple $80, Household $120 — bought monthly (a Square subscription to
-- the tier's plan variation) or one-time (a month at the tier's price). The
-- $10 day pass is unchanged.
--
--   square_feature_config  + membership_plan_id (the Square subscription plan
--                          whose fixed-price variations are the tiers; set by
--                          square-sync `create_membership_plan`). Replaces
--                          membership_plan_variation_id, which is now unused.
--   partner_payments       + tier (tier name on one-time memberships)
--
-- Then updates The Horn's membership copy to match. Each edit matches only
-- the pay-what-you-can text, so re-running is a no-op.
-- ============================================================================

alter table square_feature_config
  add column if not exists membership_plan_id text;

comment on column square_feature_config.membership_plan_variation_id is
  'Unused since 065 (pay-what-you-can). Tiers come from membership_plan_id.';

alter table partner_payments
  add column if not exists tier text;

-- ── The Horn copy ──────────────────────────────────────────────────────────
do $$
declare
  horn_id uuid;
begin
  select id into horn_id from public.partners where slug = 'the-horn';
  if horn_id is null then
    return;
  end if;

  update public.partner_pages
  set body = replace(
             regexp_replace(
               body,
               '<h2>Pay What You Can</h2>.*?(<p>Every member can bring)',
               $html$<h2>Membership</h2>
<p>Choose the membership that fits who's joining:</p>
<ul>
<li><strong>Individual</strong> — $50 a month</li>
<li><strong>Couple</strong> — $80 a month</li>
<li><strong>Household</strong> — $120 a month</li>
</ul>
<p>Pay <strong>monthly</strong> — it renews each month, and you can change or cancel anytime — or <strong>one-time</strong>: pay once for a month of membership. Nothing renews, and your card is never charged again.</p>
\1$html$,
               's'),
             'Choose monthly or one-time, pick what you can pay, and you''re in.',
             'Choose your membership, monthly or one-time, and you''re in.')
  where partner_id = horn_id
    and tab_slug = 'membership'
    and body like '%Pay What You Can%';

  update public.pages
  set body = replace(
             regexp_replace(
               body,
               '## Pay What You Can\n.*?(Every member can bring)',
               $md$## Membership

Choose the membership that fits who's joining:

- **Individual** — $50 a month
- **Couple** — $80 a month
- **Household** — $120 a month

Pay **monthly** — it renews each month, and you can change or cancel anytime — or **one-time**: pay once for a month of membership. Nothing renews, and your card is never charged again.

\1$md$,
               's'),
             'Choose monthly or one-time, pick what you can pay, and you''re in.',
             'Choose your membership, monthly or one-time, and you''re in.'),
      description = $d$Join The Horn — Lake George's community space. Individual, couple, and household memberships, monthly or one-time, for 24/7 access, morning coffee, events, game nights, and more. $10 day passes too.$d$,
      last_updated = now()
  where slug = 'membership'
    and body like '%Pay What You Can%';

  update public.partner_pages
  set body = replace(
             body,
             '<p>Membership at The Horn is <strong>pay what you can</strong>, monthly or one-time.',
             '<p>Memberships at The Horn are <strong>$50 a month</strong> for an individual, <strong>$80</strong> for a couple, and <strong>$120</strong> for a household, monthly or one-time.')
  where partner_id = horn_id
    and tab_slug = 'about'
    and body like '%<strong>pay what you can</strong>%';

  update public.partner_landing_pages
  set services = (
        select jsonb_agg(
                 case when s->>'title' = 'Pay-What-You-Can Membership'
                   then jsonb_build_object(
                     'icon', 'vpn-key',
                     'title', 'Memberships',
                     'description', '24/7 access to a private community space with games, Wi-Fi, kitchen, and more. Individual $50, couple $80, or household $120 a month, monthly or one-time.')
                   else s
                 end
                 order by ord)
        from jsonb_array_elements(services) with ordinality as e(s, ord)
      ),
      updated_at = now()
  where partner_id = horn_id
    and services @> '[{"title": "Pay-What-You-Can Membership"}]'::jsonb;
end $$;
