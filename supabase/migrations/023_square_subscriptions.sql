-- ============================================================================
-- 020: Square Subscriptions
-- Tracks per-customer Square subscription records synced from webhooks.
-- Subscription plan catalog is cached in existing square_catalog_cache table
-- (data_type = 'subscription_plan').
-- ============================================================================

create table if not exists square_subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  partner_id            uuid not null references partners(id) on delete cascade,
  square_subscription_id text unique,
  square_customer_id    text,
  plan_variation_id     text,
  tier                  text,                           -- 'individual' | 'couple' | 'family' | other
  customer_name         text,
  customer_email        text,
  status                text not null default 'pending' check (
                          status in ('pending', 'active', 'paused', 'canceled', 'deactivated')
                        ),
  started_at            timestamptz,
  canceled_at           timestamptz,
  raw                   jsonb not null default '{}',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table square_subscriptions enable row level security;

-- Admins can read; service role writes via webhooks and edge functions.
create policy "square_subscriptions: admin read"
  on square_subscriptions for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('super_admin', 'partner_editor')
    )
  );

create policy "square_subscriptions: admin write"
  on square_subscriptions for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'super_admin'
    )
  );

create index if not exists idx_square_subscriptions_partner
  on square_subscriptions(partner_id);

create index if not exists idx_square_subscriptions_status
  on square_subscriptions(partner_id, status);

create trigger trg_square_subscriptions_updated
  before update on square_subscriptions
  for each row execute function set_updated_at();

-- ── The Mane: fix hero CTA + enable subscriptions section ─────────────────
do $$
declare
  mane_id uuid;
begin
  select id into mane_id from partners where slug = 'the-mane';
  if mane_id is null then
    return;
  end if;

  update partner_landing_pages
  set hero_cta_label = coalesce(nullif(hero_cta_label, ''), 'Schedule an Appointment'),
      hero_cta_url   = '#section-bookings',
      section_order  = case
        when section_order ? 'subscriptions' then section_order
        else coalesce(section_order, '[]'::jsonb) || '["subscriptions"]'::jsonb
      end,
      updated_at = now()
  where partner_id = mane_id;

  -- Ensure feature config row exists and flip subscriptions on.
  insert into square_feature_config (partner_id, subscriptions_enabled)
  values (mane_id, true)
  on conflict (partner_id) do update
    set subscriptions_enabled = true,
        updated_at = now();
end $$;
