/**
 * Settles one-time payments (pay-what-you-can months and day passes) in
 * partner_payments once Square reports their payment-link order paid.
 *
 * Called from square-webhooks (order.updated), square-reconcile (hourly
 * safety net) and square-account `refresh` (member-triggered), mirroring how
 * subscriptions are linked in subscriptionLink.ts.
 */
import { isOrderPaid, oneTimeCoversUntil } from './flexPricing.ts';
import { PENDING_WINDOW_DAYS } from './subscriptionMatch.ts';
import { rememberCustomer, retrieveOrder } from './subscriptionLink.ts';

/* deno-lint-ignore-file no-explicit-any */

interface PendingPayment {
  id: string;
  partner_id: string;
  user_id: string | null;
  kind: 'membership_one_time' | 'day_pass';
  square_order_id: string;
}

/** Returns true when the payment was marked paid. */
export async function settlePayment(admin: any, accessToken: string, row: PendingPayment): Promise<boolean> {
  const order = await retrieveOrder(accessToken, row.square_order_id);
  if (!isOrderPaid(order)) return false;

  const paidAt = new Date(order?.closed_at ?? order?.updated_at ?? Date.now());
  await admin.from('partner_payments')
    .update({
      status: 'paid',
      paid_at: paidAt.toISOString(),
      covers_until: row.kind === 'membership_one_time' ? oneTimeCoversUntil(paidAt).toISOString() : null,
      raw: { order },
    })
    .eq('id', row.id)
    .eq('status', 'pending');

  await rememberCustomer(admin, row.partner_id, row.user_id, order?.customer_id, null);
  return true;
}

/** Settle a pending payment by its order id (webhook path). */
export async function settlePaymentByOrder(admin: any, accessToken: string, orderId: string): Promise<boolean> {
  const { data: row } = await admin
    .from('partner_payments')
    .select('id, partner_id, user_id, kind, square_order_id')
    .eq('square_order_id', orderId)
    .eq('status', 'pending')
    .maybeSingle();
  return row ? settlePayment(admin, accessToken, row) : false;
}

/**
 * Re-check recent pending payments for a partner (optionally one member's).
 * Ones left unpaid past the window are retired by expireStaleCheckouts.
 */
export async function reconcilePendingPayments(
  admin: any,
  accessToken: string,
  partnerId: string,
  userId?: string,
): Promise<number> {
  const since = new Date(Date.now() - PENDING_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

  let query = admin
    .from('partner_payments')
    .select('id, partner_id, user_id, kind, square_order_id')
    .eq('partner_id', partnerId)
    .eq('status', 'pending')
    .not('square_order_id', 'is', null)
    .gte('created_at', since);
  if (userId) query = query.eq('user_id', userId);
  const { data: rows } = await query;

  let settled = 0;
  for (const row of (rows ?? []) as PendingPayment[]) {
    if (await settlePayment(admin, accessToken, row)) settled++;
  }

  return settled;
}
