/**
 * Retires checkouts left unpaid past the pending window, for both monthly
 * memberships (square_subscriptions) and one-time payments
 * (partner_payments).
 *
 * The Square payment link is deactivated first, so a buyer who comes back
 * to an old checkout page can't be charged with nothing on our side to
 * record it. Nothing is retired unless Square has confirmed the order is
 * unpaid and the link is gone, so a Square outage can never cancel a live
 * checkout. A checkout whose order turns out to be paid is left alone for
 * linking or settling.
 *
 * Runs from square-reconcile (hourly).
 */
import { squareFetch } from './square.ts';
import { isOrderPaid } from './flexPricing.ts';
import { PENDING_WINDOW_DAYS } from './subscriptionMatch.ts';
import { retrieveOrder } from './subscriptionLink.ts';
import { settlePayment } from './paymentSettle.ts';

/* deno-lint-ignore-file no-explicit-any */

/** Batch size per run; the hourly reconcile works through any backlog. */
const BATCH = 50;

/** Deactivate a payment link. True once Square confirms it's gone. */
async function deactivatePaymentLink(accessToken: string, linkId: string): Promise<boolean> {
  const res = await squareFetch(`/v2/online-checkout/payment-links/${linkId}`, accessToken, { method: 'DELETE' });
  await res.body?.cancel();
  return res.ok || res.status === 404;
}

/**
 * 'retire' once the order is confirmed unpaid and the link removed; 'paid'
 * if the order was paid after all; 'unknown' if Square couldn't confirm
 * (retry next run).
 */
async function checkoutState(
  accessToken: string,
  orderId: string | null,
  linkId: string | null,
): Promise<'retire' | 'paid' | 'unknown'> {
  if (orderId) {
    const order = await retrieveOrder(accessToken, orderId);
    if (!order) return 'unknown';
    if (isOrderPaid(order)) return 'paid';
  }
  if (linkId && !(await deactivatePaymentLink(accessToken, linkId))) return 'unknown';
  return 'retire';
}

export async function expireStaleCheckouts(
  admin: any,
  accessToken: string,
  partnerId: string,
): Promise<{ expired: number; settled: number; paid_unlinked: number }> {
  const before = new Date(Date.now() - PENDING_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const stats = { expired: 0, settled: 0, paid_unlinked: 0 };

  // Monthly: the pending row is only a placeholder for a subscription that
  // never started, so it's removed rather than kept as a fake cancellation.
  const { data: subs, error: subsErr } = await admin
    .from('square_subscriptions')
    .select('id, square_order_id, square_payment_link_id')
    .eq('partner_id', partnerId)
    .eq('status', 'pending')
    .is('square_subscription_id', null)
    .lt('created_at', before)
    .limit(BATCH);
  if (subsErr) throw new Error(`Failed to load stale checkouts: ${subsErr.message}`);

  for (const row of subs ?? []) {
    const state = await checkoutState(accessToken, row.square_order_id, row.square_payment_link_id);
    if (state === 'paid') {
      // Paid, but no subscription ever claimed it: needs a person to look.
      console.warn(`Stale checkout ${row.id} has a paid order but no linked subscription`);
      stats.paid_unlinked++;
    }
    if (state !== 'retire') continue;
    const { error } = await admin.from('square_subscriptions')
      .delete()
      .eq('id', row.id)
      .eq('status', 'pending')
      .is('square_subscription_id', null);
    if (!error) stats.expired++;
  }

  // One-time memberships and day passes: a last settle attempt, then cancel.
  const { data: payments, error: paymentsErr } = await admin
    .from('partner_payments')
    .select('id, partner_id, user_id, kind, square_order_id, square_payment_link_id')
    .eq('partner_id', partnerId)
    .eq('status', 'pending')
    .lt('created_at', before)
    .limit(BATCH);
  if (paymentsErr) throw new Error(`Failed to load stale payments: ${paymentsErr.message}`);

  for (const row of payments ?? []) {
    if (row.square_order_id && await settlePayment(admin, accessToken, row)) {
      stats.settled++;
      continue;
    }
    const state = await checkoutState(accessToken, row.square_order_id, row.square_payment_link_id);
    if (state !== 'retire') continue;
    const { error } = await admin.from('partner_payments')
      .update({ status: 'canceled' })
      .eq('id', row.id)
      .eq('status', 'pending');
    if (!error) stats.expired++;
  }

  return stats;
}
