/**
 * Where a member's subscription is headed, for the account page. Square
 * schedules pause and cancel for the end of the billing period, and the
 * subscription stays active until then: a canceled member is still paid up
 * ("Active until …"), a pausing one still renews until the pause date.
 */

export interface OutlookInput {
  status: 'pending' | 'active' | 'paused' | 'canceled' | 'deactivated';
  canceled_at: string | null;
  cancel_at_period_end: boolean;
  scheduled_action: 'PAUSE' | 'RESUME' | 'CANCEL' | null;
  scheduled_action_date: string | null;
}

/** Today as YYYY-MM-DD in local time, to compare with Square's plain dates. */
export function todayISO(now = new Date()): string {
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

/**
 * The calendar day of a plain Square date, or null for a real timestamp.
 * Square sends "2026-11-18". Columns of type `date` return it that way, but
 * `canceled_at` and `current_period_end` are timestamptz, so it comes back as
 * midnight UTC ("2026-11-18T00:00:00+00:00").
 */
export function squareDay(iso: string): string | null {
  const day = /^(\d{4}-\d{2}-\d{2})(?:T00:00:00(?:\.0+)?(?:Z|\+00(?::?00)?))?$/.exec(iso);
  return day ? day[1] : null;
}

/** Parse a timestamp, or a plain Square date as that day in local time. */
export function parseDate(iso: string): Date {
  const day = squareDay(iso);
  if (!day) return new Date(iso);
  // new Date('2026-11-18') is UTC midnight, which shows as the 17th in US time.
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year, month - 1, date);
}

/** `ending`: the last paid-up date of a canceled subscription; `pausing`: a scheduled pause date. */
export function subscriptionOutlook(
  sub: OutlookInput,
  today = todayISO(),
): { ending: string | null; pausing: string | null } {
  const upcoming = sub.scheduled_action_date && sub.scheduled_action_date >= today ? sub.scheduled_action : null;
  const ending =
    sub.status === 'active' && (sub.cancel_at_period_end || upcoming === 'CANCEL')
      ? (sub.canceled_at ?? sub.scheduled_action_date)
      : null;
  const pausing = sub.status === 'active' && !ending && upcoming === 'PAUSE' ? sub.scheduled_action_date : null;
  return { ending, pausing };
}
