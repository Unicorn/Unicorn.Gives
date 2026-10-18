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

/** The customer Square attached to a payment-link order once it was paid. */
export async function retrieveOrderCustomerId(
  accessToken: string,
  orderId: string,
): Promise<string | null> {
  const res = await squareFetch(`/v2/orders/${orderId}`, accessToken, { method: 'GET' });
  if (!res.ok) return null;
  const data = await res.json() as { order?: { customer_id?: string } };
  return data.order?.customer_id ?? null;
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

  // Already known: update state, but never drop an established owner.
  const { data: existing } = await admin
    .from('square_subscriptions')
    .select('id, user_id')
    .eq('square_subscription_id', sub.id)
    .maybeSingle();
  if (existing) {
    const userId = existing.user_id ?? await mappedUserId(admin, partnerId, sub.customer_id);
    await admin.from('square_subscriptions')
      .update({ ...fields, user_id: userId })
      .eq('id', existing.id);
    return { userId, outcome: 'existing' };
  }

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
      await admin.from('square_subscriptions')
        .update({ ...fields, user_id: userId })
        .eq('id', match.row.id);
      await rememberCustomer(admin, partnerId, userId, sub.customer_id, customer);
      return { userId, outcome };
    }
  }

  // Bought outside our checkout (e.g. in the Square dashboard): last resort,
  // a profile with the same email.
  if (!userId && customerEmail) {
    const { data: profile } = await admin
      .from('profiles')
      .select('id')
      .ilike('email', customerEmail)
      .maybeSingle();
    if (profile?.id) {
      userId = profile.id;
      outcome = 'profile_email';
    }
  }

  await admin.from('square_subscriptions')
    .upsert({ ...fields, user_id: userId }, { onConflict: 'square_subscription_id' });
  await rememberCustomer(admin, partnerId, userId, sub.customer_id, customer);
  return { userId, outcome };
}

/** Map the Square customer to the user so later events resolve directly. */
async function rememberCustomer(
  admin: any,
  partnerId: string,
  userId: string | null,
  customerId: string | undefined,
  customer: Record<string, unknown> | null,
) {
  if (!userId || !customerId) return;
  await admin.from('square_customers').upsert({
    user_id: userId,
    partner_id: partnerId,
    square_customer_id: customerId,
    email: (customer?.email_address as string | undefined) ?? null,
    given_name: (customer?.given_name as string | undefined) ?? null,
    family_name: (customer?.family_name as string | undefined) ?? null,
    ...(customer ? { raw: customer } : {}),
    synced_at: new Date().toISOString(),
  }, { onConflict: 'partner_id,square_customer_id' });
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
      if (outcome !== 'existing') linked++;
    }
  }
  return linked;
}
