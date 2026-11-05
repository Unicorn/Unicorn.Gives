/**
 * Turns a partner's subscriptions and one-time payments into the rows on the
 * admin Members tab. "Current" means the same as the member-facing "My
 * membership" check: an active or paused subscription, or a paid one-time
 * month that hasn't run out. Unfinished checkouts are not members and aren't
 * listed.
 */
import { formatDollars } from './payWhatYouCan';

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
  profiles: MemberPerson | null;
}

export interface MemberPayment {
  id: string;
  user_id: string | null;
  kind: string;
  amount_cents: number;
  paid_at: string | null;
  covers_until: string | null;
  profiles: MemberPerson | null;
}

export interface MemberRow {
  id: string;
  name: string;
  email: string | null;
  /** e.g. "Monthly · $25" */
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

/** Dates read on the partner's clock, wherever the admin is. */
function formatDay(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: 'America/Detroit',
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

function subscriptionRow(s: MemberSubscription): MemberRow {
  const price = s.amount_cents ? formatDollars(s.amount_cents) : s.tier ? capitalize(s.tier) : null;
  const plan = ['Monthly', price].filter(Boolean).join(' · ');
  const who = person(s.id, s.user_id, s.profiles, s.customer_name, s.customer_email);

  if (s.status === 'active' && s.cancel_at_period_end) {
    return { id: s.id, ...who, plan, status: 'Ending', detail: `Active until ${formatDay(s.canceled_at ?? s.current_period_end)}`, current: true };
  }
  if (s.status === 'active') {
    return { id: s.id, ...who, plan, status: 'Active', detail: s.next_billing_at ? `Next bill ${formatDay(s.next_billing_at)}` : null, current: true };
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
    plan: `One-time · ${formatDollars(p.amount_cents)}`,
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
  const members = [
    ...subscriptions.filter((s) => s.status !== 'pending').map(subscriptionRow),
    ...payments.filter((p) => p.kind !== 'day_pass').map((p) => paymentRow(p, now)),
  ].sort((a, b) => Number(b.current) - Number(a.current) || a.name.localeCompare(b.name));

  return {
    members,
    dayPasses: payments.filter((p) => p.kind === 'day_pass').map((p) => paymentRow(p, now)),
    currentCount: new Set(members.filter((m) => m.current).map((m) => m.personKey)).size,
  };
}
