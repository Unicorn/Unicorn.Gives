-- ============================================================================
-- 061: Pay-what-you-can membership + day pass (The Horn)
--
-- The Horn drops fixed tiers ($40/$60/$100 + $20 VIP) for one membership
-- people pay what they can for — $10 to $100 or any amount above $10 —
-- either monthly (a Square subscription billed at the chosen amount) or as a
-- one-time payment that covers a month. A $10 day pass covers one visit.
--
--   partner_payments            one-time memberships and day passes
--   square_subscriptions        + amount_cents (the member's chosen monthly amount)
--   square_feature_config       + membership_plan_variation_id (Square plan the
--                               monthly membership bills under; when unset and
--                               the partner has exactly one plan, that one is used)
--
-- Then rewrites The Horn's membership page and landing-page services to match.
-- ============================================================================

-- ── partner_payments ───────────────────────────────────────────────────────
create table if not exists partner_payments (
  id                     uuid primary key default gen_random_uuid(),
  partner_id             uuid not null references partners(id) on delete cascade,
  user_id                uuid references profiles(id) on delete set null,
  kind                   text not null check (kind in ('membership_one_time', 'day_pass')),
  amount_cents           integer not null check (amount_cents > 0),
  currency               text not null default 'USD',
  status                 text not null default 'pending' check (status in ('pending', 'paid', 'canceled')),
  square_order_id        text unique,
  square_payment_link_id text,
  paid_at                timestamptz,
  -- Membership access ends here (one-time memberships only).
  covers_until           timestamptz,
  raw                    jsonb not null default '{}',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

alter table partner_payments enable row level security;

-- Writes come only from edge functions (service role).
create policy "partner_payments: user read own"
  on partner_payments for select
  using (user_id = auth.uid());

create policy "partner_payments: admin read"
  on partner_payments for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('super_admin', 'partner_editor')
    )
  );

create index if not exists idx_partner_payments_user
  on partner_payments(user_id, partner_id, status);

create index if not exists idx_partner_payments_pending
  on partner_payments(partner_id, created_at desc)
  where status = 'pending';

create trigger trg_partner_payments_updated
  before update on partner_payments
  for each row execute function set_updated_at();

-- ── chosen monthly amount + plan config ────────────────────────────────────
alter table square_subscriptions
  add column if not exists amount_cents integer;

alter table square_feature_config
  add column if not exists membership_plan_variation_id text;

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
  set body = $html$<h2>Your Place. Any Time of Day.</h2>
<p>The Horn is a nonprofit community space designed to bring people together — a place rooted in belonging. Start your morning with a coffee and a quiet corner to read, work, or think. Spend the afternoon with neighbors. Unwind in the evening, and know there's somewhere safe and welcoming to be long after everywhere else has closed.</p>
<p>Members get 24/7 access, so The Horn fits your day — whatever your day looks like. No closing time.</p>
<hr>
<h2>Pay What You Can</h2>
<p>We believe a place to belong shouldn't depend on what's in your wallet. There's one membership, and you choose what to pay.</p>
<ul>
<li><strong>Monthly</strong> — renews each month at the amount you chose. Change or cancel anytime.</li>
<li><strong>One-time</strong> — pay once for a month of membership. Nothing renews, and your card is never charged again.</li>
</ul>
<p>Every member can bring <strong>one guest</strong> along. Bringing more friends? Each additional guest just needs a day pass.</p>
<h3>Day Pass — $10</h3>
<p>Not ready to join, or bringing extra guests? A day pass gets you a full day at The Horn for <strong>$10</strong>. The members' lounge is reserved for members.</p>
<blockquote>
<p><strong>Want to see it first?</strong> The Horn is open to the public daily from <strong>10 AM – 2 PM</strong>. Stop by, see the space, and meet the community.</p>
</blockquote>
<hr>
<h2>What You Get</h2>
<h3>Morning Coffee &amp; Quiet Space</h3>
<p>Ease into the day with a coffee and a calm, comfortable spot to read, work, or just be. A peaceful start before the day gets busy.</p>
<h3>24/7 Access</h3>
<p>This is your place — come anytime, day or night. Members get key access around the clock, 365 days a year.</p>
<h3>Free Wi-Fi &amp; Work-Friendly Space</h3>
<p>Need a place to get things done? The Horn has reliable Wi-Fi and a comfortable setup for remote work, studying, or creative projects.</p>
<h3>Food &amp; Kitchen Access</h3>
<p>Members can use the kitchen for their own food prep. We also host occasional potluck nights where the community comes together over a shared table.</p>
<h3>Game Nights &amp; Entertainment</h3>
<p>Board games, video games, TVs, and music — all available to members. Regular game nights bring the community together for some friendly competition.</p>
<h3>Events — Indoors &amp; Out</h3>
<p>Bonfire nights, seasonal gatherings, potlucks, and more. Members get access to exclusive events plus priority for all public programming at The Horn.</p>
<h3>Discounted Event Rates</h3>
<p>Members enjoy discounted rates on events at The Horn — whether you're celebrating a birthday, hosting a gathering, or joining one of our community events.</p>
<h3>Bring a Guest</h3>
<p>Members can bring one guest to share the experience. Additional guests are welcome with a $10 day pass.</p>
<h3>Late-Night Safe Hangout</h3>
<p>A safe, welcoming place to be after hours. No bar scene, no pressure — just good company and a comfortable space when everywhere else is closed.</p>
<h3>Free Parking (24/7)</h3>
<p>Dedicated parking available around the clock — no meters, no hassle, no matter what time you stop by.</p>
<h3>Exclusive Community</h3>
<p>This isn't just a membership — it's a community. Connect with your neighbors, meet new people, and be part of something that's genuinely ours.</p>
<h3>Members' Lounge</h3>
<p>An adults-only lounge, for members only, where you can bring your own drinks and smoke indoors. A private space within the space.</p>
<hr>
<h2>Why People Join</h2>
<ul>
<li><strong>"This is my place."</strong> — A space that feels like yours, not someone else's business</li>
<li><strong>A calm start to the day</strong> — Coffee and a quiet corner before the world wakes up</li>
<li><strong>Social connection</strong> — Meet like-minded people and build real friendships</li>
<li><strong>Escape boredom &amp; loneliness</strong> — There's always something to do and someone to hang with</li>
<li><strong>A safe place, day or night</strong> — Somewhere to go when everything else is closed</li>
<li><strong>Be part of something</strong> — A community built by and for people in Lake George</li>
</ul>
<hr>
<h2>Join Today</h2>
<p>Choose monthly or one-time, pick what you can pay, and you're in. Or pick up a $10 day pass to try it out.</p>$html$,
      updated_at = now()
  where partner_id = horn_id
    and tab_slug = 'membership';

  -- The legacy `pages` copy (slug 'membership', seeded in 002) isn't shown on
  -- the public site but is editable in admin; keep it in sync with
  -- content/pages/membership.md so the old tiers and VIP can't be republished.
  update public.pages
  set body = $md$## Your Place. Any Time of Day.

The Horn is a nonprofit community space designed to bring people together — a place rooted in belonging. Start your morning with a coffee and a quiet corner to read, work, or think. Spend the afternoon with neighbors. Unwind in the evening, and know there's somewhere safe and welcoming to be long after everywhere else has closed.

Members get 24/7 access, so The Horn fits your day — whatever your day looks like. No closing time.

---

## Pay What You Can

We believe a place to belong shouldn't depend on what's in your wallet. There's one membership, and you choose what to pay.

- **Monthly** — renews each month at the amount you chose. Change or cancel anytime.
- **One-time** — pay once for a month of membership. Nothing renews, and your card is never charged again.

Every member can bring **one guest** along. Bringing more friends? Each additional guest just needs a day pass.

### Day Pass — $10

Not ready to join, or bringing extra guests? A day pass gets you a full day at The Horn for **$10**. The members' lounge is reserved for members.

> **Want to see it first?** The Horn is open to the public daily from **10 AM – 2 PM**. Stop by, see the space, and meet the community.

---

## What You Get

### Morning Coffee & Quiet Space
Ease into the day with a coffee and a calm, comfortable spot to read, work, or just be. A peaceful start before the day gets busy.

### 24/7 Access
This is your place — come anytime, day or night. Members get key access around the clock, 365 days a year.

### Free Wi-Fi & Work-Friendly Space
Need a place to get things done? The Horn has reliable Wi-Fi and a comfortable setup for remote work, studying, or creative projects.

### Food & Kitchen Access
Members can use the kitchen for their own food prep. We also host occasional potluck nights where the community comes together over a shared table.

### Game Nights & Entertainment
Board games, video games, TVs, and music — all available to members. Regular game nights bring the community together for some friendly competition.

### Events — Indoors & Out
Bonfire nights, seasonal gatherings, potlucks, and more. Members get access to exclusive events plus priority for all public programming at The Horn.

### Discounted Event Rates
Members enjoy discounted rates on events at The Horn — whether you're celebrating a birthday, hosting a gathering, or joining one of our community events.

### Bring a Guest
Members can bring one guest to share the experience. Additional guests are welcome with a $10 day pass.

### Late-Night Safe Hangout
A safe, welcoming place to be after hours. No bar scene, no pressure — just good company and a comfortable space when everywhere else is closed.

### Free Parking (24/7)
Dedicated parking available around the clock — no meters, no hassle, no matter what time you stop by.

### Exclusive Community
This isn't just a membership — it's a community. Connect with your neighbors, meet new people, and be part of something that's genuinely ours.

### Members' Lounge
An adults-only lounge, for members only, where you can bring your own drinks and smoke indoors. A private space within the space.

---

## Why People Join

- **"This is my place."** — A space that feels like yours, not someone else's business
- **A calm start to the day** — Coffee and a quiet corner before the world wakes up
- **Social connection** — Meet like-minded people and build real friendships
- **Escape boredom & loneliness** — There's always something to do and someone to hang with
- **A safe place, day or night** — Somewhere to go when everything else is closed
- **Be part of something** — A community built by and for people in Lake George

---

## Join Today

Choose monthly or one-time, pick what you can pay, and you're in. Or pick up a $10 day pass to try it out.

**[Join The Horn](/partners/the-horn/membership)** · **[Visit](/partners/the-horn/hours)** · **[Events at The Horn](/partners/the-horn/events)** · **[About The Horn](/partners/the-horn/about)**
$md$,
      description = $d$Join The Horn — Lake George's community space. Pay what you can, monthly or one-time, for 24/7 access, morning coffee, events, game nights, and more. $10 day passes too.$d$,
      last_updated = now()
  where slug = 'membership';

  -- About page: same offer changes, as targeted edits (the rest of the page
  -- is unchanged). Each pattern matches only the old text, so re-running is a no-op.
  update public.partner_pages
  set body = regexp_replace(
             regexp_replace(
               regexp_replace(
                 regexp_replace(
                   regexp_replace(
                     regexp_replace(
                       body,
                       '<li><strong>VIP Lounge</strong>[^<]*</li>\n?', '', 'g'),
                     '(<li><strong>Members-Only Club</strong>)',
                     '<li><strong>Morning Coffee &amp; Quiet Space</strong> — Start the day with a coffee and a calm corner to read, work, or just be</li>' || E'\n' || '\1'),
                   '(<li><strong>Work-Friendly Environment</strong>[^<]*</li>)',
                   '\1' || E'\n' || '<li><strong>Members'' Lounge</strong> — An adults-only lounge for members only — bring your own drinks and smoke indoors</li>'),
                 '<p>The Horn offers individual, couple, and family memberships[^\n]*</p>',
                 '<p>Membership at The Horn is <strong>pay what you can</strong>, monthly or one-time. Members get 24/7 key access, discounted event rates, exclusive events, and a real community, and can bring one guest. Not ready to join? Grab a <strong>$10 day pass</strong>.</p>'),
               '<p>Memberships launch <strong>Memorial Weekend</strong>[^\n]*</p>\n?', ''),
             'href="/membership"', 'href="/partners/the-horn/membership"', 'g'),
      updated_at = now()
  where partner_id = horn_id
    and tab_slug = 'about'
    and body like '%VIP Lounge%';

  update public.partner_landing_pages
  set services = $json$[
    {"icon": "local-cafe", "title": "Morning Coffee & Quiet Space", "description": "Start the day with a coffee and a calm corner to read, work, or just be."},
    {"icon": "vpn-key", "title": "Pay-What-You-Can Membership", "description": "24/7 access to a private community space with games, Wi-Fi, kitchen, and more — you choose what to pay, monthly or one-time."},
    {"icon": "confirmation-number", "title": "$10 Day Pass", "description": "Spend a full day at The Horn without a membership — or bring extra guests along."},
    {"icon": "groups", "title": "Community Gathering Space", "description": "A welcoming place to connect with neighbors and friends during public hours."},
    {"icon": "celebration", "title": "Events & Entertainment", "description": "Game nights, bonfire nights, potlucks, and community programming year-round with discounted member rates."},
    {"icon": "nightlight-round", "title": "Late-Night Safe Hangout", "description": "A comfortable place to be when everywhere else is closed. No bar scene, no pressure — just good company."},
    {"icon": "weekend", "title": "Members' Lounge", "description": "An adults-only lounge for members only — bring your own drinks and smoke indoors."}
  ]$json$::jsonb,
      updated_at = now()
  where partner_id = horn_id;
end $$;
