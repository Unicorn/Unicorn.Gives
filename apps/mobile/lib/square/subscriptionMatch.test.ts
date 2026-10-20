import { describe, it, expect } from 'vitest';
import {
  escapeLike,
  mapSquareSubscriptionStatus,
  matchPendingCheckout,
  priceOverrideNeeded,
  type IncomingSubscription,
  type PendingCheckout,
} from '../../../../supabase/functions/_shared/subscriptionMatch';

const PLAN = 'PLAN_INDIVIDUAL';

function pending(overrides: Partial<PendingCheckout> = {}): PendingCheckout {
  return {
    id: 'row-1',
    user_id: 'user-1',
    plan_variation_id: PLAN,
    square_customer_id: null,
    order_customer_id: null,
    customer_email: 'member@example.com',
    created_at: '2026-10-17T10:00:00Z',
    ...overrides,
  };
}

function sub(overrides: Partial<IncomingSubscription> = {}): IncomingSubscription {
  return {
    customer_id: 'CUST_NEW',
    plan_variation_id: PLAN,
    created_at: '2026-10-17T10:05:00Z',
    customer_email: null,
    ...overrides,
  };
}

describe('matchPendingCheckout', () => {
  it('matches on the paid order customer', () => {
    const result = matchPendingCheckout([pending({ order_customer_id: 'CUST_NEW' })], sub());
    expect(result?.row.id).toBe('row-1');
    expect(result?.reason).toBe('order_customer');
  });

  it('prefers the order customer over an email match on another row', () => {
    const rows = [
      pending({ id: 'by-email', created_at: '2026-10-17T10:04:00Z' }),
      pending({ id: 'by-order', user_id: 'user-2', order_customer_id: 'CUST_NEW', customer_email: 'other@example.com' }),
    ];
    const result = matchPendingCheckout(rows, sub({ customer_email: 'member@example.com' }));
    expect(result?.row.id).toBe('by-order');
  });

  it('matches a customer we already had mapped', () => {
    const result = matchPendingCheckout([pending({ square_customer_id: 'CUST_NEW' })], sub());
    expect(result?.reason).toBe('customer');
  });

  it('falls back to email, ignoring case and whitespace', () => {
    const result = matchPendingCheckout([pending()], sub({ customer_email: '  Member@Example.COM ' }));
    expect(result?.reason).toBe('email');
  });

  it('picks the most recent checkout when several match', () => {
    const rows = [
      pending({ id: 'older', created_at: '2026-10-16T09:00:00Z' }),
      pending({ id: 'newer', created_at: '2026-10-17T09:59:00Z' }),
    ];
    const result = matchPendingCheckout(rows, sub({ customer_email: 'member@example.com' }));
    expect(result?.row.id).toBe('newer');
  });

  it('never matches a different plan', () => {
    const result = matchPendingCheckout(
      [pending({ plan_variation_id: 'PLAN_FAMILY', order_customer_id: 'CUST_NEW' })],
      sub(),
    );
    expect(result).toBeNull();
  });

  it('ignores checkouts started after the subscription (beyond clock skew)', () => {
    const result = matchPendingCheckout(
      [pending({ order_customer_id: 'CUST_NEW', created_at: '2026-10-17T12:00:00Z' })],
      sub(),
    );
    expect(result).toBeNull();
  });

  it('tolerates small clock skew', () => {
    const result = matchPendingCheckout(
      [pending({ order_customer_id: 'CUST_NEW', created_at: '2026-10-17T10:30:00Z' })],
      sub(),
    );
    expect(result?.reason).toBe('order_customer');
  });

  it('ignores checkouts older than the window', () => {
    const result = matchPendingCheckout(
      [pending({ order_customer_id: 'CUST_NEW', created_at: '2026-09-01T10:00:00Z' })],
      sub(),
    );
    expect(result).toBeNull();
  });

  it('returns null when nothing ties the subscription to a checkout', () => {
    expect(matchPendingCheckout([pending()], sub({ customer_email: 'stranger@example.com' }))).toBeNull();
    expect(matchPendingCheckout([], sub())).toBeNull();
  });
});

describe('mapSquareSubscriptionStatus', () => {
  it('maps Square statuses and defaults to pending', () => {
    expect(mapSquareSubscriptionStatus('ACTIVE')).toBe('active');
    expect(mapSquareSubscriptionStatus('PAUSED')).toBe('paused');
    expect(mapSquareSubscriptionStatus('CANCELED')).toBe('canceled');
    expect(mapSquareSubscriptionStatus('DEACTIVATED')).toBe('deactivated');
    expect(mapSquareSubscriptionStatus('PENDING')).toBe('pending');
    expect(mapSquareSubscriptionStatus(undefined)).toBe('pending');
  });
});

describe('escapeLike', () => {
  it('makes LIKE wildcards literal', () => {
    expect(escapeLike('j_doe@gmail.com')).toBe('j\\_doe@gmail.com');
    expect(escapeLike('100%@example.com')).toBe('100\\%@example.com');
    expect(escapeLike('back\\slash@example.com')).toBe('back\\\\slash@example.com');
  });

  it('leaves ordinary addresses unchanged', () => {
    expect(escapeLike('member@example.com')).toBe('member@example.com');
  });
});

describe('priceOverrideNeeded', () => {
  it('sets the chosen amount when Square has no override or a different one', () => {
    expect(priceOverrideNeeded(2500, { status: 'ACTIVE' })).toBe(true);
    expect(priceOverrideNeeded(2500, { status: 'ACTIVE', price_override_money: { amount: 1000 } })).toBe(true);
  });

  it('leaves a matching override alone', () => {
    expect(priceOverrideNeeded(2500, { status: 'ACTIVE', price_override_money: { amount: 2500 } })).toBe(false);
  });

  it('skips fixed-tier subscriptions and ended ones', () => {
    expect(priceOverrideNeeded(null, { status: 'ACTIVE' })).toBe(false);
    expect(priceOverrideNeeded(undefined, { status: 'ACTIVE' })).toBe(false);
    expect(priceOverrideNeeded(2500, { status: 'CANCELED' })).toBe(false);
    expect(priceOverrideNeeded(2500, { status: 'DEACTIVATED' })).toBe(false);
  });
});
