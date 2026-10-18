-- ============================================================================
-- 059: Correlate pending checkouts with the subscriptions Square creates
--
-- create_checkout inserts a `pending` row before the buyer pays. Square
-- Checkout matches buyers by phone number, so the subscription usually lands
-- under a customer we have never seen and carries no reference back to us.
-- The payment link's order is the stable key: once paid, the order's
-- customer_id is the subscription's customer. Store it so webhooks and the
-- reconcile job can promote the pending row instead of orphaning it.
-- ============================================================================

alter table square_subscriptions
  add column if not exists square_order_id text,
  add column if not exists square_payment_link_id text;

create index if not exists idx_square_subscriptions_pending_checkout
  on square_subscriptions(partner_id, plan_variation_id, created_at desc)
  where square_subscription_id is null and status = 'pending';
