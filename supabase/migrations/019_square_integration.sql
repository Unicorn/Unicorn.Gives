-- ============================================================================
-- 019: Square Integration
-- Stores OAuth connections, feature toggles, cached booking/catalog data,
-- and webhook event log for Square merchant integrations.
-- ============================================================================

-- ── square_connections ──────────────────────────────────────────────────────
-- One row per partner. Tokens are encrypted at the Edge Function layer before
-- being stored, so the column type is TEXT (base64 ciphertext).
create table if not exists square_connections (
  id           uuid primary key default gen_random_uuid(),
  partner_id   uuid not null references partners(id) on delete cascade,
  merchant_id  text not null,
  location_id  text,                          -- selected location (Square may have many)
  location_ids jsonb not null default '[]',    -- all locations available
  access_token text not null,                  -- encrypted ciphertext
  refresh_token text not null,                 -- encrypted ciphertext
  token_expires_at timestamptz,
  scopes       text[] not null default '{}',
  environment  text not null default 'production' check (environment in ('sandbox', 'production')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint   uq_square_connections_partner unique (partner_id)
);

alter table square_connections enable row level security;

-- Only super_admin and owning partner_editor can see connections
create policy "square_connections: admin read"
  on square_connections for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'super_admin'
    )
    or exists (
      select 1 from profiles p
      join partners pt on pt.id = square_connections.partner_id
      where p.id = auth.uid()
        and p.role = 'partner_editor'
    )
  );

create policy "square_connections: admin write"
  on square_connections for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'super_admin'
    )
  );

-- ── square_feature_config ──────────────────────────────────────────────────
-- Per-partner feature toggles. Public can read enabled flags so the
-- LandingPageRenderer knows which Square sections to show.
create table if not exists square_feature_config (
  id                   uuid primary key default gen_random_uuid(),
  partner_id           uuid not null references partners(id) on delete cascade,
  bookings_enabled     boolean not null default false,
  subscriptions_enabled boolean not null default false,
  retail_enabled       boolean not null default false,
  gift_cards_enabled   boolean not null default false,
  bookings_config      jsonb not null default '{}',
  subscriptions_config jsonb not null default '{}',
  retail_config        jsonb not null default '{}',
  gift_cards_config    jsonb not null default '{}',
  last_synced_at       timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint           uq_square_feature_config_partner unique (partner_id)
);

alter table square_feature_config enable row level security;

create policy "square_feature_config: public read"
  on square_feature_config for select using (true);

create policy "square_feature_config: admin write"
  on square_feature_config for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('super_admin', 'partner_editor')
    )
  );

-- ── square_bookings_cache ──────────────────────────────────────────────────
-- Synced from Square Bookings/Catalog APIs. Public reads for the partner page.
create table if not exists square_bookings_cache (
  id            uuid primary key default gen_random_uuid(),
  partner_id    uuid not null references partners(id) on delete cascade,
  data_type     text not null check (data_type in ('service', 'team_member', 'booking_profile')),
  square_id     text not null,                  -- Square object ID
  data          jsonb not null default '{}',     -- full Square object
  display_name  text,
  display_order int not null default 0,
  is_active     boolean not null default true,
  synced_at     timestamptz not null default now(),
  constraint    uq_square_bookings_cache unique (partner_id, data_type, square_id)
);

alter table square_bookings_cache enable row level security;

create policy "square_bookings_cache: public read"
  on square_bookings_cache for select using (true);

create policy "square_bookings_cache: service write"
  on square_bookings_cache for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('super_admin', 'partner_editor')
    )
  );

-- ── square_catalog_cache ───────────────────────────────────────────────────
-- Phase 2+: synced catalog items, subscription plans, gift card types.
create table if not exists square_catalog_cache (
  id            uuid primary key default gen_random_uuid(),
  partner_id    uuid not null references partners(id) on delete cascade,
  data_type     text not null check (data_type in ('item', 'subscription_plan', 'gift_card_type', 'category')),
  square_id     text not null,
  data          jsonb not null default '{}',
  display_name  text,
  display_order int not null default 0,
  is_active     boolean not null default true,
  synced_at     timestamptz not null default now(),
  constraint    uq_square_catalog_cache unique (partner_id, data_type, square_id)
);

alter table square_catalog_cache enable row level security;

create policy "square_catalog_cache: public read"
  on square_catalog_cache for select using (true);

create policy "square_catalog_cache: service write"
  on square_catalog_cache for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('super_admin', 'partner_editor')
    )
  );

-- ── square_webhook_events ──────────────────────────────────────────────────
-- Idempotency log + debugging for incoming Square webhooks.
create table if not exists square_webhook_events (
  id              uuid primary key default gen_random_uuid(),
  event_id        text not null unique,           -- Square event ID
  event_type      text not null,
  merchant_id     text,
  partner_id      uuid references partners(id) on delete set null,
  payload         jsonb not null default '{}',
  processed       boolean not null default false,
  error           text,
  received_at     timestamptz not null default now()
);

alter table square_webhook_events enable row level security;

create policy "square_webhook_events: admin only"
  on square_webhook_events for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'super_admin'
    )
  );

-- No public write policy — webhook inserts use service role key

-- ── Indexes ────────────────────────────────────────────────────────────────
create index if not exists idx_square_bookings_cache_partner
  on square_bookings_cache(partner_id, data_type);

create index if not exists idx_square_catalog_cache_partner
  on square_catalog_cache(partner_id, data_type);

create index if not exists idx_square_webhook_events_merchant
  on square_webhook_events(merchant_id);

-- ── Updated-at triggers ────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_square_connections_updated
  before update on square_connections
  for each row execute function set_updated_at();

create trigger trg_square_feature_config_updated
  before update on square_feature_config
  for each row execute function set_updated_at();
