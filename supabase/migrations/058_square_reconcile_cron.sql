-- Hourly Square reconciliation (audit 2026-10-13, item 10).
--
-- square-reconcile is the safety net for missed webhooks, but nothing called it.
-- This schedules it hourly through pg_cron + pg_net. The call needs the
-- service-role key, which must not live in a migration: add it once in the
-- dashboard under Project Settings → Vault as a secret named
-- `square_reconcile_key` (value: the service_role JWT). Until it exists the
-- job logs a notice and does nothing.

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

create or replace function public.run_square_reconcile()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  key text;
begin
  select decrypted_secret into key
  from vault.decrypted_secrets
  where name = 'square_reconcile_key'
  limit 1;

  if key is null then
    raise notice 'square_reconcile_key is not set in Vault; skipping reconcile';
    return;
  end if;

  perform net.http_post(
    url := 'https://kifhbevwmpqdeuxqnjxa.supabase.co/functions/v1/square-reconcile',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || key
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
end;
$$;

revoke all on function public.run_square_reconcile() from public;

-- Idempotent: replace any previous schedule with the same name.
do $$
begin
  perform cron.unschedule('square-reconcile-hourly');
exception when others then
  null;
end;
$$;

select cron.schedule('square-reconcile-hourly', '7 * * * *', $$select public.run_square_reconcile()$$);
