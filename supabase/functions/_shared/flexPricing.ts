/**
 * Timing rules for one-time memberships and day passes: how long a one-time
 * month lasts and when a payment-link order counts as paid. Prices live in
 * `membershipTiers.ts`.
 *
 * No Deno or Supabase imports: also unit-tested from
 * `apps/mobile/lib/square/flexPricing.test.ts`.
 */

/** The Horn and its partners are in Michigan; "a month" follows their calendar. */
export const PARTNER_TIME_ZONE = 'America/Detroit';

/** Wall-clock parts of `at` in `timeZone`, expressed as a UTC timestamp. */
function wallClockAsUtc(at: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(at);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
}

/**
 * When a one-time membership paid at `paidAt` stops granting access: one
 * calendar month later on the partner's clock, same time of day. Clamped to
 * the last day of a shorter month, so Jan 31 runs to Feb 28 (29 in a leap
 * year), not Mar 3.
 *
 * Buying again before the current month runs out extends it: pass the
 * unexpired end as `currentEnd` and the new month starts there, so no days
 * are lost.
 */
export function oneTimeCoversUntil(
  paidAt: Date,
  currentEnd?: Date | null,
  timeZone: string = PARTNER_TIME_ZONE,
): Date {
  const start = currentEnd && currentEnd > paidAt ? currentEnd : paidAt;
  const local = new Date(wallClockAsUtc(start.getTime(), timeZone));
  const day = local.getUTCDate();
  local.setUTCDate(1);
  local.setUTCMonth(local.getUTCMonth() + 1);
  const lastDay = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth() + 1, 0)).getUTCDate();
  local.setUTCDate(Math.min(day, lastDay));

  // Back to an instant. Measure the zone's offset at the result, not at the
  // start, so a month across a daylight-saving change keeps the time of day.
  const target = local.getTime();
  const firstGuess = target - (wallClockAsUtc(target, timeZone) - target);
  return new Date(target - (wallClockAsUtc(firstGuess, timeZone) - firstGuess));
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
