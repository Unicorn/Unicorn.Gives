/**
 * Pricing rules for pay-what-you-can memberships and day passes.
 *
 * The server is the authority: the client sends the amount the member
 * picked and `validateFlexCheckout` decides what is actually charged. Day
 * passes are always the fixed price, whatever the client sends.
 *
 * No Deno or Supabase imports: also unit-tested from
 * `apps/mobile/lib/square/flexPricing.test.ts`.
 */

export type FlexKind = 'monthly' | 'one_time' | 'day_pass';

export const MIN_AMOUNT_CENTS = 1_000;
/** Guards against typos like $5000 for $50; larger gifts can go through the Horn directly. */
export const MAX_AMOUNT_CENTS = 100_000;
export const DAY_PASS_CENTS = 1_000;
/** A one-time membership payment covers this many days. */
export const ONE_TIME_COVER_DAYS = 30;

export type FlexValidation =
  | { ok: true; kind: FlexKind; amountCents: number }
  | { ok: false; error: string };

export function validateFlexCheckout(kind: unknown, amountCents: unknown): FlexValidation {
  if (kind !== 'monthly' && kind !== 'one_time' && kind !== 'day_pass') {
    return { ok: false, error: 'Choose monthly, one-time, or a day pass' };
  }
  if (kind === 'day_pass') {
    return { ok: true, kind, amountCents: DAY_PASS_CENTS };
  }
  if (typeof amountCents !== 'number' || !Number.isInteger(amountCents)) {
    return { ok: false, error: 'Enter an amount in whole cents' };
  }
  if (amountCents < MIN_AMOUNT_CENTS) {
    return { ok: false, error: 'The minimum is $10' };
  }
  if (amountCents > MAX_AMOUNT_CENTS) {
    return { ok: false, error: 'The maximum online is $1,000' };
  }
  return { ok: true, kind, amountCents };
}

/** When a one-time membership paid at `paidAt` stops granting access. */
export function oneTimeCoversUntil(paidAt: Date): Date {
  return new Date(paidAt.getTime() + ONE_TIME_COVER_DAYS * 24 * 60 * 60 * 1000);
}

/** Line-item name shown on Square's checkout page and receipt. */
export function flexItemName(kind: FlexKind, partnerName: string): string {
  switch (kind) {
    case 'monthly':
      return `${partnerName} membership (monthly)`;
    case 'one_time':
      return `${partnerName} membership (one month)`;
    case 'day_pass':
      return `${partnerName} day pass`;
  }
}

/**
 * Whether a Square order created from a payment link has been paid.
 * Payment-link orders carry a tender once the buyer pays, and nothing is
 * left due; a canceled order never counts.
 */
export function isOrderPaid(order: {
  state?: string;
  tenders?: unknown[];
  net_amount_due_money?: { amount?: number };
} | null | undefined): boolean {
  if (!order || order.state === 'CANCELED') return false;
  const tendered = Array.isArray(order.tenders) && order.tenders.length > 0;
  const due = order.net_amount_due_money?.amount ?? 0;
  return tendered && due <= 0;
}
