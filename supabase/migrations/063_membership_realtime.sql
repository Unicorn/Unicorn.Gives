-- ============================================================================
-- 063: Realtime for membership tables
--
-- The account page and the partner menu bar subscribe to changes on
-- square_subscriptions and partner_payments, so a webhook or reconcile that
-- activates a membership shows up without a reload. Neither table was in the
-- supabase_realtime publication, so those subscriptions never fired.
-- Row-level security still applies: each member only receives their own rows.
--
-- Idempotent: each table is added only if it isn't published yet.
-- ============================================================================

do $$
declare
  t text;
begin
  foreach t in array array['square_subscriptions', 'partner_payments'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
