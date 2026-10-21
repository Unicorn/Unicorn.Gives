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

/** Parse a timestamp, or a plain Square date ("2026-11-18") as a local date. */
export function parseDate(iso: string): Date {
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  // new Date('2026-11-18') is UTC midnight, which shows as the 17th in US time.
  return day ? new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3])) : new Date(iso);
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
