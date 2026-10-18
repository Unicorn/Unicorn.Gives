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
  it('covers 30 days from payment', () => {
    expect(oneTimeCoversUntil(new Date('2026-10-01T12:00:00Z')).toISOString()).toBe('2026-10-31T12:00:00.000Z');
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
