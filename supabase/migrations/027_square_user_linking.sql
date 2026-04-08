-- ============================================================================
-- 025: Square ↔ User Linking
-- Ties Square customers, subscriptions, and bookings to Supabase profiles so
-- authenticated users can view and manage their own data. Also adds a sync
-- jobs audit table for the reconcile safety net.
-- ============================================================================

-- ── square_customers ──────────────────────────────────────────────────────
create table if not exists square_customers (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references profiles(id) on delete cascade,
  partner_id            uuid not null references partners(id) on delete cascade,
  square_customer_id    text not null,
  email                 text,
  given_name            text,
  family_name           text,
  raw                   jsonb not null default '{}',
  synced_at             timestamptz not null default now(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint uq_square_customers_partner_customer unique (partner_id, square_customer_id)
);

alter table square_customers enable row level security;

create policy "square_customers: user read own"
  on square_customers for select
  using (user_id = auth.uid());

create policy "square_customers: admin read"
  on square_customers for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('super_admin', 'partner_editor')
    )
  );

create policy "square_customers: super_admin write"
  on square_customers for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'super_admin'
    )
  );

create index if not exists idx_square_customers_user on square_customers(user_id);
create index if not exists idx_square_customers_partner on square_customers(partner_id);

create trigger trg_square_customers_updated
  before update on square_customers
  for each row execute function set_updated_at();

-- ── extend square_subscriptions ───────────────────────────────────────────
alter table square_subscriptions
  add column if not exists user_id uuid references profiles(id) on delete set null,
  add column if not exists current_period_end timestamptz,
  add column if not exists next_billing_at timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false;

create index if not exists idx_square_subscriptions_user
  on square_subscriptions(user_id, status);

create policy "square_subscriptions: user read own"
  on square_subscriptions for select
  using (user_id = auth.uid());

-- ── square_bookings (actual booking records, not the catalog cache) ───────
create table if not exists square_bookings (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references profiles(id) on delete set null,
  partner_id            uuid not null references partners(id) on delete cascade,
  square_booking_id     text not null unique,
  square_customer_id    text,
  start_at              timestamptz,
  status                text,
  service_variation_id  text,
  team_member_id        text,
  raw                   jsonb not null default '{}',
  synced_at             timestamptz not null default now(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table square_bookings enable row level security;

create policy "square_bookings: user read own"
  on square_bookings for select
  using (user_id = auth.uid());

create policy "square_bookings: admin read"
  on square_bookings for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('super_admin', 'partner_editor')
    )
  );

create policy "square_bookings: super_admin write"
  on square_bookings for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'super_admin'
    )
  );

create index if not exists idx_square_bookings_user on square_bookings(user_id, start_at desc);
create index if not exists idx_square_bookings_partner on square_bookings(partner_id);
create index if not exists idx_square_bookings_customer on square_bookings(square_customer_id);

create trigger trg_square_bookings_updated
  before update on square_bookings
  for each row execute function set_updated_at();

-- ── square_sync_jobs (reconcile audit) ─────────────────────────────────────
create table if not exists square_sync_jobs (
  id           uuid primary key default gen_random_uuid(),
  partner_id   uuid references partners(id) on delete cascade,
  kind         text not null check (kind in ('customer','subscription','booking','full')),
  status       text not null default 'running' check (status in ('running','success','error')),
  started_at   timestamptz not null default now(),
  finished_at  timestamptz,
  error        text,
  stats        jsonb not null default '{}'
);

alter table square_sync_jobs enable row level security;

create policy "square_sync_jobs: admin read"
  on square_sync_jobs for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('super_admin', 'partner_editor')
    )
  );

create index if not exists idx_square_sync_jobs_partner on square_sync_jobs(partner_id, started_at desc);
