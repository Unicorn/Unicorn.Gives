/**
 * Turns a partner's subscriptions and one-time payments into the rows on the
 * admin Members tab. "Current" means the same as the member-facing "My
 * membership" check: an active or paused subscription, or a paid one-time
 * month that hasn't run out. Unfinished checkouts are not members and aren't
 * listed.
 */
import { squareDay, subscriptionOutlook, todayISO, type OutlookInput } from '../account/subscriptionOutlook';
import { formatDollars } from './membershipPricing';

export interface MemberPerson {
  display_name: string | null;
  email: string | null;
}

export interface MemberSubscription {
  id: string;
  user_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  tier: string | null;
  amount_cents: number | null;
  status: string;
  cancel_at_period_end: boolean | null;
  canceled_at: string | null;
  next_billing_at: string | null;
  current_period_end: string | null;
  scheduled_action: OutlookInput['scheduled_action'];
  scheduled_action_date: string | null;
  profiles: MemberPerson | null;
}

export interface MemberPayment {
  id: string;
  user_id: string | null;
  kind: string;
  /** Tier name on one-time memberships; absent on older rows. */
  tier?: string | null;
  amount_cents: number;
  paid_at: string | null;
  covers_until: string | null;
  profiles: MemberPerson | null;
}

export interface MemberRow {
  id: string;
  name: string;
  email: string | null;
  /** e.g. "Monthly · Couple · $80" */
  plan: string;
  status: string;
  /** e.g. "Next bill Nov 3, 2026" */
  detail: string | null;
  current: boolean;
  /** Identifies the person, so several payments count once. */
  personKey: string;
}

export interface MemberSummary {
  members: MemberRow[];
  dayPasses: MemberRow[];
  /** People with current access. */
  currentCount: number;
}

/**
 * Real timestamps read on the partner's clock, wherever the admin is. A plain
 * Square date is already a calendar day, so it isn't shifted to any clock.
 */
function formatDay(iso: string | null): string {
  if (!iso) return '';
  const day = squareDay(iso);
  return new Date(day ? `${day}T00:00:00Z` : iso).toLocaleDateString('en-US', {
    timeZone: day ? 'UTC' : 'America/Detroit',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function person(id: string, userId: string | null, profile: MemberPerson | null, name?: string | null, email?: string | null) {
  const resolvedEmail = profile?.email ?? email ?? null;
  return {
    name: profile?.display_name?.trim() || name?.trim() || resolvedEmail || 'Unknown member',
    email: resolvedEmail,
    personKey: userId ?? resolvedEmail?.toLowerCase() ?? id,
  };
}

function subscriptionRow(s: MemberSubscription, today: string): MemberRow {
  const tier = s.tier ? capitalize(s.tier) : null;
  const plan = ['Monthly', tier, s.amount_cents ? formatDollars(s.amount_cents) : null].filter(Boolean).join(' · ');
  const who = person(s.id, s.user_id, s.profiles, s.customer_name, s.customer_email);
  // Same rules as the member's account page.
  const { ending, pausing } = subscriptionOutlook(
    {
      status: s.status as OutlookInput['status'],
      canceled_at: s.canceled_at,
      cancel_at_period_end: Boolean(s.cancel_at_period_end),
      scheduled_action: s.scheduled_action,
      scheduled_action_date: s.scheduled_action_date,
    },
    today,
  );

  if (ending) {
    return { id: s.id, ...who, plan, status: 'Ending', detail: `Active until ${formatDay(ending)}`, current: true };
  }
  if (pausing) {
    return { id: s.id, ...who, plan, status: 'Pausing', detail: `Pauses ${formatDay(pausing)}`, current: true };
  }
  if (s.status === 'active') {
    // next_billing_at only arrives with invoice webhooks; the paid-through date is always there once billed.
    const nextBill = s.next_billing_at ?? s.current_period_end;
    return { id: s.id, ...who, plan, status: 'Active', detail: nextBill ? `Next bill ${formatDay(nextBill)}` : null, current: true };
  }
  if (s.status === 'paused') {
    return { id: s.id, ...who, plan, status: 'Paused', detail: null, current: true };
  }
  return { id: s.id, ...who, plan, status: 'Canceled', detail: s.canceled_at ? `Ended ${formatDay(s.canceled_at)}` : null, current: false };
}

function paymentRow(p: MemberPayment, now: number): MemberRow {
  const who = person(p.id, p.user_id, p.profiles);
  if (p.kind === 'day_pass') {
    return { id: p.id, ...who, plan: `Day pass · ${formatDollars(p.amount_cents)}`, status: 'Paid', detail: `Bought ${formatDay(p.paid_at)}`, current: false };
  }
  const current = p.covers_until != null && Date.parse(p.covers_until) > now;
  return {
    id: p.id,
    ...who,
    plan: ['One-time', p.tier, formatDollars(p.amount_cents)].filter(Boolean).join(' · '),
    status: current ? 'Active' : 'Expired',
    detail: p.covers_until ? `${current ? 'Member through' : 'Ended'} ${formatDay(p.covers_until)}` : null,
    current,
  };
}

export function buildMemberRows(
  subscriptions: MemberSubscription[],
  payments: MemberPayment[],
  now: number = Date.now(),
): MemberSummary {
  const today = todayISO(new Date(now));
  const members = [
    ...subscriptions.filter((s) => s.status !== 'pending').map((s) => subscriptionRow(s, today)),
    ...payments.filter((p) => p.kind !== 'day_pass').map((p) => paymentRow(p, now)),
  ].sort((a, b) => Number(b.current) - Number(a.current) || a.name.localeCompare(b.name));

  return {
    members,
    dayPasses: payments.filter((p) => p.kind === 'day_pass').map((p) => paymentRow(p, now)),
    currentCount: new Set(members.filter((m) => m.current).map((m) => m.personKey)).size,
  };
}
