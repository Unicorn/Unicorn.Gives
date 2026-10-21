-- ============================================================================
-- 064: Remember a subscription's scheduled pause / resume / cancel
--
-- Square doesn't pause or cancel a subscription immediately: it schedules the
-- action for the end of the billing period, and the subscription stays ACTIVE
-- until then. The account page needs the scheduled action to say "Pauses
-- {date}" or "Active until {date}" instead of looking unchanged (or, before,
-- claiming "canceled" while the member was still paid up).
--
-- Filled from Square's response to pause / resume / cancel and from searches
-- that include actions (reconcile, member refresh). Webhooks don't carry
-- actions and leave these columns alone.
-- ============================================================================

alter table square_subscriptions
  add column if not exists scheduled_action text
    check (scheduled_action in ('PAUSE', 'RESUME', 'CANCEL')),
  add column if not exists scheduled_action_date date;
