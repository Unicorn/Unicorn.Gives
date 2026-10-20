/**
 * Writes Square subscriptions into square_subscriptions, promoting the
 * pending row left by `create_checkout` and attaching the user who paid.
 *
 * Used by square-webhooks (live), square-reconcile (hourly safety net) and
 * square-account `refresh` (member-triggered), so all three agree on how a
 * subscription finds its owner.
 */
import { retrieveCustomer, searchSubscriptions, squareFetch } from './square.ts';
import {
  escapeLike,
  mapSquareSubscriptionStatus,
  matchPendingCheckout,
  PENDING_WINDOW_DAYS,
  type MatchReason,
  type PendingCheckout,
} from './subscriptionMatch.ts';

/* deno-lint-ignore-file no-explicit-any */

export interface SquareSubscription {
  id?: string;
  customer_id?: string;
  plan_variation_id?: string;
  status?: string;
  start_date?: string;
  canceled_date?: string;
  charged_through_date?: string;
  canceled_at_period_end?: boolean;
  created_at?: string;
}

export type LinkOutcome = MatchReason | 'existing' | 'customer_map' | 'profile_email' | 'unlinked';

export interface SquareOrder {
  id?: string;
  customer_id?: string;
  state?: string;
  tenders?: unknown[];
  net_amount_due_money?: { amount?: number };
  closed_at?: string;
  updated_at?: string;
}

export async function retrieveOrder(accessToken: string, orderId: string): Promise<SquareOrder | null> {
  const res = await squareFetch(`/v2/orders/${orderId}`, accessToken, { method: 'GET' });
  if (!res.ok) return null;
  const data = await res.json() as { order?: SquareOrder };
  return data.order ?? null;
}

/** The customer Square attached to a payment-link order once it was paid. */
export async function retrieveOrderCustomerId(
  accessToken: string,
  orderId: string,
): Promise<string | null> {
  return (await retrieveOrder(accessToken, orderId))?.customer_id ?? null;
}

async function mappedUserId(admin: any, partnerId: string, customerId: string | undefined) {
  if (!customerId) return null;
  const { data } = await admin
    .from('square_customers')
    .select('user_id')
    .eq('partner_id', partnerId)
    .eq('square_customer_id', customerId)
    .maybeSingle();
  return (data?.user_id as string | undefined) ?? null;
}

/**
 * Upsert one Square subscription. `accessToken` may be null (e.g. the
 * connection is broken); matching then falls back to what is already stored.
 */
export async function linkSubscription(
  admin: any,
  accessToken: string | null,
  partnerId: string,
  sub: SquareSubscription,
  raw: Record<string, unknown> = sub as Record<string, unknown>,
): Promise<{ userId: string | null; outcome: LinkOutcome }> {
  if (!sub.id) return { userId: null, outcome: 'unlinked' };

  const now = new Date().toISOString();
  const fields = {
    partner_id: partnerId,
    square_subscription_id: sub.id,
    square_customer_id: sub.customer_id ?? null,
    plan_variation_id: sub.plan_variation_id ?? null,
    status: mapSquareSubscriptionStatus(sub.status),
    started_at: sub.start_date ?? null,
    canceled_at: sub.canceled_date ?? null,
    current_period_end: sub.charged_through_date ?? null,
    cancel_at_period_end: sub.canceled_at_period_end ?? false,
    raw,
    updated_at: now,
  };

  // Already known with an owner: update state, never drop the owner.
  const { data: existing, error: existingErr } = await admin
    .from('square_subscriptions')
    .select('id, user_id')
    .eq('square_subscription_id', sub.id)
    .maybeSingle();
  check(existingErr, 'look up subscription');
  if (existing?.user_id) {
    check(
      (await admin.from('square_subscriptions').update(fields).eq('id', existing.id)).error,
      'update subscription',
    );
    return { userId: existing.user_id, outcome: 'existing' };
  }

  // New, or saved earlier without an owner (a Square error or a racing
  // webhook made the first match miss): keep looking, so the hourly
  // reconcile can still link it.
  let userId = await mappedUserId(admin, partnerId, sub.customer_id);
  let outcome: LinkOutcome = userId ? 'customer_map' : 'unlinked';

  // Look for the checkout that started this subscription.
  const since = new Date(Date.now() - PENDING_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  let pendingQuery = admin
    .from('square_subscriptions')
    .select('id, user_id, plan_variation_id, square_customer_id, square_order_id, customer_email, created_at')
    .eq('partner_id', partnerId)
    .eq('status', 'pending')
    .is('square_subscription_id', null)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(25);
  if (sub.plan_variation_id) pendingQuery = pendingQuery.eq('plan_variation_id', sub.plan_variation_id);
  const { data: pendingRows } = await pendingQuery;

  let customer: Record<string, unknown> | null = null;
  if (accessToken && sub.customer_id) {
    customer = await retrieveCustomer(accessToken, sub.customer_id);
  }
  const customerEmail = (customer?.email_address as string | undefined) ?? null;

  if (pendingRows?.length) {
    const candidates: PendingCheckout[] = [];
    for (const row of pendingRows) {
      const orderCustomerId = accessToken && row.square_order_id
        ? await retrieveOrderCustomerId(accessToken, row.square_order_id)
        : null;
      candidates.push({
        id: row.id,
        user_id: row.user_id,
        plan_variation_id: row.plan_variation_id,
        square_customer_id: row.square_customer_id,
        order_customer_id: orderCustomerId,
        customer_email: row.customer_email,
        created_at: row.created_at,
      });
    }

    const match = matchPendingCheckout(candidates, {
      customer_id: sub.customer_id ?? null,
      plan_variation_id: sub.plan_variation_id ?? null,
      created_at: sub.created_at ?? null,
      customer_email: customerEmail,
    });

    if (match) {
      userId = userId ?? match.row.user_id;
      outcome = match.reason;
      await promotePending(admin, match.row.id, sub.id, { ...fields, user_id: userId });
      await rememberCustomer(admin, partnerId, userId, sub.customer_id, customer);
      return { userId, outcome };
    }
  }

  // Bought outside our checkout (e.g. in the Square dashboard): last resort,
  // a profile with the same email. The Square email is unverified buyer
  // input, so it must match exactly — never as a LIKE pattern.
  if (!userId && customerEmail) {
    const { data: profile } = await admin
      .from('profiles')
      .select('id')
      .ilike('email', escapeLike(customerEmail.trim()))
      .maybeSingle();
    if (profile?.id) {
      userId = profile.id;
      outcome = 'profile_email';
    }
  }

  check(
    (await admin.from('square_subscriptions')
      .upsert({ ...fields, user_id: userId }, { onConflict: 'square_subscription_id' })).error,
    'save subscription',
  );
  await rememberCustomer(admin, partnerId, userId, sub.customer_id, customer);
  return { userId, outcome };
}

/**
 * Turn the pending checkout row into the subscription's row. If the
 * subscription was already saved without an owner (an earlier miss, or a
 * concurrent webhook), that row holds the unique Square id: drop it and let
 * the pending row — which carries the checkout's details — take its place.
 */
async function promotePending(
  admin: any,
  pendingId: string,
  squareSubscriptionId: string,
  row: Record<string, unknown>,
) {
  const promote = () => admin.from('square_subscriptions').update(row).eq('id', pendingId);
  let { error } = await promote();
  if (error?.code === UNIQUE_VIOLATION) {
    check(
      (await admin.from('square_subscriptions')
        .delete()
        .eq('square_subscription_id', squareSubscriptionId)
        .is('user_id', null)).error,
      'replace unowned subscription',
    );
    ({ error } = await promote());
  }
  check(error, 'promote pending checkout');
}

const UNIQUE_VIOLATION = '23505';

function check(error: { message?: string } | null | undefined, what: string) {
  if (error) throw new Error(`Failed to ${what}: ${error.message ?? 'unknown error'}`);
}

/** Map the Square customer to the user so later events resolve directly. */
export async function rememberCustomer(
  admin: any,
  partnerId: string,
  userId: string | null,
  customerId: string | undefined,
  customer: Record<string, unknown> | null,
) {
  if (!userId || !customerId) return;
  // Only write the details we actually fetched, so a failed or skipped
  // customer lookup doesn't null out what's already stored.
  const details = customer
    ? {
      email: (customer.email_address as string | undefined) ?? null,
      given_name: (customer.given_name as string | undefined) ?? null,
      family_name: (customer.family_name as string | undefined) ?? null,
      raw: customer,
    }
    : {};
  check(
    (await admin.from('square_customers').upsert({
      user_id: userId,
      partner_id: partnerId,
      square_customer_id: customerId,
      ...details,
      synced_at: new Date().toISOString(),
    }, { onConflict: 'partner_id,square_customer_id' })).error,
    'map customer to user',
  );
}

/**
 * Safety net for checkouts whose subscription webhook never arrived: follow
 * each recent pending row's order to its customer and pull that customer's
 * subscriptions. Pass `userId` to limit it to one member's checkouts.
 */
export async function reconcilePendingCheckouts(
  admin: any,
  accessToken: string,
  partnerId: string,
  locationId: string,
  userId?: string,
): Promise<number> {
  const since = new Date(Date.now() - PENDING_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  let query = admin
    .from('square_subscriptions')
    .select('square_order_id')
    .eq('partner_id', partnerId)
    .eq('status', 'pending')
    .is('square_subscription_id', null)
    .not('square_order_id', 'is', null)
    .gte('created_at', since);
  if (userId) query = query.eq('user_id', userId);
  const { data: rows } = await query;

  const seenCustomers = new Set<string>();
  let linked = 0;
  for (const row of rows ?? []) {
    const customerId = await retrieveOrderCustomerId(accessToken, row.square_order_id);
    if (!customerId || seenCustomers.has(customerId)) continue;
    seenCustomers.add(customerId);

    const subs = await searchSubscriptions(accessToken, customerId, locationId);
    for (const sub of subs) {
      const { outcome } = await linkSubscription(admin, accessToken, partnerId, sub as SquareSubscription);
      if (outcome !== 'existing' && outcome !== 'unlinked') linked++;
    }
  }
  return linked;
}
