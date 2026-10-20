/**
 * Pure matching rules that tie a Square subscription back to the checkout
 * that started it.
 *
 * `create_checkout` inserts a `pending` square_subscriptions row before the
 * buyer pays. Square then creates the subscription on its own — and, because
 * Checkout matches buyers by phone number, usually under a customer we have
 * never seen. These rules decide which pending row a new subscription
 * belongs to so it is promoted in place instead of orphaning the pending row
 * and losing the user link.
 *
 * No Deno or Supabase imports: this file is also unit-tested from
 * `apps/mobile/lib/square/subscriptionMatch.test.ts`.
 */

export interface PendingCheckout {
  id: string;
  user_id: string | null;
  plan_variation_id: string | null;
  /** Customer we already had on file for this user when checkout started. */
  square_customer_id: string | null;
  /** Customer Square attached to the paid payment-link order. */
  order_customer_id: string | null;
  customer_email: string | null;
  created_at: string;
}

export interface IncomingSubscription {
  customer_id: string | null;
  plan_variation_id: string | null;
  created_at: string | null;
  /** Email on the Square customer that owns the subscription, if fetched. */
  customer_email: string | null;
}

export type MatchReason = 'order_customer' | 'customer' | 'email';

/** How far back a pending checkout can still claim a new subscription. */
export const PENDING_WINDOW_DAYS = 14;

/** Tolerance for clock skew between our insert and Square's created_at. */
const SKEW_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function normEmail(email: string | null | undefined): string | null {
  const e = email?.trim().toLowerCase();
  return e ? e : null;
}

/**
 * Pick the pending checkout a subscription belongs to, or null.
 *
 * Strongest evidence wins: the paid order's customer, then a customer we
 * already mapped to the user, then the buyer's email. Plans must agree, and
 * the checkout must have started before the subscription (within the
 * window). Ties go to the most recent checkout.
 */
export function matchPendingCheckout(
  pending: PendingCheckout[],
  sub: IncomingSubscription,
): { row: PendingCheckout; reason: MatchReason } | null {
  const subTime = sub.created_at ? Date.parse(sub.created_at) : NaN;

  const eligible = pending
    .filter((p) => {
      if (sub.plan_variation_id && p.plan_variation_id && p.plan_variation_id !== sub.plan_variation_id) {
        return false;
      }
      if (Number.isNaN(subTime)) return true;
      const t = Date.parse(p.created_at);
      return t <= subTime + SKEW_MS && t >= subTime - PENDING_WINDOW_DAYS * DAY_MS;
    })
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

  const customerId = sub.customer_id;
  if (customerId) {
    const byOrder = eligible.find((p) => p.order_customer_id === customerId);
    if (byOrder) return { row: byOrder, reason: 'order_customer' };

    const byCustomer = eligible.find((p) => p.square_customer_id === customerId);
    if (byCustomer) return { row: byCustomer, reason: 'customer' };
  }

  const email = normEmail(sub.customer_email);
  if (email) {
    const byEmail = eligible.find((p) => normEmail(p.customer_email) === email);
    if (byEmail) return { row: byEmail, reason: 'email' };
  }

  return null;
}

/**
 * Escape LIKE wildcards so ILIKE compares literally (case-insensitively).
 * Needed wherever a Square-supplied value — unverified buyer input — is
 * matched against our data.
 */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export function mapSquareSubscriptionStatus(status: string | undefined): string {
  switch (status) {
    case 'ACTIVE':
      return 'active';
    case 'PAUSED':
      return 'paused';
    case 'CANCELED':
      return 'canceled';
    case 'DEACTIVATED':
      return 'deactivated';
    default:
      return 'pending';
  }
}
