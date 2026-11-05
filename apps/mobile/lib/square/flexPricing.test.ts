import { describe, it, expect } from 'vitest';
import {
  DAY_PASS_CENTS,
  flexItemName,
  isOrderPaid,
  oneTimeCoversUntil,
  validateFlexCheckout,
} from '../../../../supabase/functions/_shared/flexPricing';

describe('validateFlexCheckout', () => {
  it('accepts monthly and one-time amounts from $10 to $1,000', () => {
    expect(validateFlexCheckout('monthly', 1_000)).toEqual({ ok: true, kind: 'monthly', amountCents: 1_000 });
    expect(validateFlexCheckout('one_time', 4_500)).toEqual({ ok: true, kind: 'one_time', amountCents: 4_500 });
    expect(validateFlexCheckout('monthly', 100_000).ok).toBe(true);
  });

  it('rejects amounts under $10 or over $1,000', () => {
    expect(validateFlexCheckout('monthly', 999)).toEqual({ ok: false, error: 'The minimum is $10' });
    expect(validateFlexCheckout('one_time', 100_001)).toEqual({ ok: false, error: 'The maximum online is $1,000' });
  });

  it('rejects non-integer or missing amounts', () => {
    expect(validateFlexCheckout('monthly', 10.5).ok).toBe(false);
    expect(validateFlexCheckout('monthly', '2000').ok).toBe(false);
    expect(validateFlexCheckout('one_time', undefined).ok).toBe(false);
  });

  it('always charges the fixed day-pass price', () => {
    expect(validateFlexCheckout('day_pass', 1)).toEqual({ ok: true, kind: 'day_pass', amountCents: DAY_PASS_CENTS });
    expect(validateFlexCheckout('day_pass', undefined)).toEqual({ ok: true, kind: 'day_pass', amountCents: DAY_PASS_CENTS });
  });

  it('rejects unknown kinds', () => {
    expect(validateFlexCheckout('vip', 2_000).ok).toBe(false);
  });
});

describe('oneTimeCoversUntil', () => {
  const until = (iso: string, currentEnd?: string | null) =>
    oneTimeCoversUntil(new Date(iso), currentEnd ? new Date(currentEnd) : null).toISOString();

  it('covers one calendar month on the Michigan clock', () => {
    // 10 AM EDT to 10 AM EST: same time of day across the clock change.
    expect(until('2026-10-18T14:00:00Z')).toBe('2026-11-18T15:00:00.000Z');
    expect(until('2026-12-05T15:00:00Z')).toBe('2027-01-05T15:00:00.000Z');
  });

  it('keeps the time of day when clocks go forward', () => {
    // Mar 1 10 AM EST to Apr 1 10 AM EDT.
    expect(until('2027-03-01T15:00:00Z')).toBe('2027-04-01T14:00:00.000Z');
  });

  it('clamps to the end of a shorter month', () => {
    expect(until('2027-01-31T17:00:00Z')).toBe('2027-02-28T17:00:00.000Z');
    expect(until('2028-01-31T17:00:00Z')).toBe('2028-02-29T17:00:00.000Z');
    expect(until('2026-03-31T16:00:00Z')).toBe('2026-04-30T16:00:00.000Z');
  });

  it('anchors a late-evening payment to its Michigan date, not the UTC one', () => {
    // Jan 30 8:30 PM EST is already Jan 31 in UTC. Runs to Feb 28 8:30 PM EST.
    expect(until('2027-01-31T01:30:00Z')).toBe('2027-03-01T01:30:00.000Z');
    // Oct 31 9 PM EDT is Nov 1 in UTC. Runs to Nov 30 9 PM EST.
    expect(until('2026-11-01T01:00:00Z')).toBe('2026-12-01T02:00:00.000Z');
  });

  it('extends from an unexpired month so no days are lost', () => {
    // Paid Oct 25 with cover to Nov 18: runs to Dec 18.
    expect(until('2026-10-25T14:00:00Z', '2026-11-18T15:00:00Z')).toBe('2026-12-18T15:00:00.000Z');
  });

  it('starts from the payment when the old month has run out', () => {
    expect(until('2026-10-25T14:00:00Z', '2026-10-01T14:00:00Z')).toBe('2026-11-25T15:00:00.000Z');
    expect(until('2026-10-25T14:00:00Z', null)).toBe('2026-11-25T15:00:00.000Z');
  });
});

describe('flexItemName', () => {
  it('names each kind for the receipt', () => {
    expect(flexItemName('monthly', 'The Horn')).toBe('The Horn membership (monthly)');
    expect(flexItemName('one_time', 'The Horn')).toBe('The Horn membership (one month)');
    expect(flexItemName('day_pass', 'The Horn')).toBe('The Horn day pass');
  });
});

describe('isOrderPaid', () => {
  it('is paid once tendered with nothing due', () => {
    expect(isOrderPaid({ state: 'OPEN', tenders: [{}], net_amount_due_money: { amount: 0 } })).toBe(true);
    expect(isOrderPaid({ state: 'COMPLETED', tenders: [{}] })).toBe(true);
  });

  it('is unpaid without a tender, with money due, or when canceled', () => {
    expect(isOrderPaid({ state: 'OPEN' })).toBe(false);
    expect(isOrderPaid({ state: 'OPEN', tenders: [{}], net_amount_due_money: { amount: 500 } })).toBe(false);
    expect(isOrderPaid({ state: 'CANCELED', tenders: [{}] })).toBe(false);
    expect(isOrderPaid(null)).toBe(false);
  });
});
