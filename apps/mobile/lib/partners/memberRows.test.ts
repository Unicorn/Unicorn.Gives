import { describe, it, expect } from 'vitest';
import { buildMemberRows, type MemberPayment, type MemberSubscription } from './memberRows';

const NOW = Date.parse('2026-11-05T17:00:00Z');

function sub(overrides: Partial<MemberSubscription> = {}): MemberSubscription {
  return {
    id: 's1',
    user_id: 'u1',
    customer_name: null,
    customer_email: null,
    tier: null,
    amount_cents: 2_500,
    status: 'active',
    cancel_at_period_end: false,
    canceled_at: null,
    next_billing_at: null,
    current_period_end: null,
    profiles: { display_name: 'Ana Reyes', email: 'ana@example.com' },
    ...overrides,
  };
}

function pay(overrides: Partial<MemberPayment> = {}): MemberPayment {
  return {
    id: 'p1',
    user_id: 'u2',
    kind: 'membership_one_time',
    amount_cents: 3_000,
    paid_at: '2026-10-20T14:00:00Z',
    covers_until: '2026-11-20T15:00:00Z',
    profiles: { display_name: 'Ben Cole', email: 'ben@example.com' },
    ...overrides,
  };
}

const members = (subs: MemberSubscription[], pays: MemberPayment[] = []) => buildMemberRows(subs, pays, NOW).members;

describe('subscription rows', () => {
  it('shows an active monthly member with the chosen amount and next bill', () => {
    expect(members([sub({ next_billing_at: '2026-12-03T15:00:00Z' })])[0]).toMatchObject({
      name: 'Ana Reyes',
      email: 'ana@example.com',
      plan: 'Monthly · $25',
      status: 'Active',
      detail: 'Next bill Dec 3, 2026',
      current: true,
    });
  });

  it('labels a fixed tier when there is no chosen amount', () => {
    expect(members([sub({ amount_cents: null, tier: 'family' })])[0].plan).toBe('Monthly · Family');
  });

  it('counts a scheduled cancel as current until it takes effect', () => {
    expect(members([sub({ cancel_at_period_end: true, canceled_at: '2026-12-01T15:00:00Z' })])[0]).toMatchObject({
      status: 'Ending',
      detail: 'Active until Dec 1, 2026',
      current: true,
    });
  });

  it('counts paused as current and canceled or deactivated as not', () => {
    expect(members([sub({ status: 'paused' })])[0]).toMatchObject({ status: 'Paused', current: true });
    expect(members([sub({ status: 'canceled', canceled_at: '2026-10-01T15:00:00Z' })])[0]).toMatchObject({
      status: 'Canceled',
      detail: 'Ended Oct 1, 2026',
      current: false,
    });
    expect(members([sub({ status: 'deactivated' })])[0].current).toBe(false);
  });

  it('leaves out unfinished checkouts', () => {
    expect(members([sub({ status: 'pending' })])).toEqual([]);
  });

  it('falls back to checkout details, then a placeholder, when there is no profile', () => {
    const noProfile = { profiles: null, user_id: null };
    expect(members([sub({ ...noProfile, customer_name: 'Cal Dee', customer_email: 'cal@example.com' })])[0]).toMatchObject({
      name: 'Cal Dee',
      email: 'cal@example.com',
    });
    expect(members([sub({ ...noProfile, customer_email: 'cal@example.com' })])[0].name).toBe('cal@example.com');
    expect(members([sub(noProfile)])[0]).toMatchObject({ name: 'Unknown member', email: null });
  });
});

describe('payment rows', () => {
  it('shows a paid-up one-time month', () => {
    expect(members([], [pay()])[0]).toMatchObject({
      plan: 'One-time · $30',
      status: 'Active',
      detail: 'Member through Nov 20, 2026',
      current: true,
    });
  });

  it('shows a month that ran out as expired', () => {
    expect(members([], [pay({ covers_until: '2026-11-01T15:00:00Z' })])[0]).toMatchObject({
      status: 'Expired',
      detail: 'Ended Nov 1, 2026',
      current: false,
    });
  });

  it('lists day passes separately, not as members', () => {
    const result = buildMemberRows([], [pay({ kind: 'day_pass', amount_cents: 1_000, covers_until: null })], NOW);
    expect(result.members).toEqual([]);
    expect(result.currentCount).toBe(0);
    expect(result.dayPasses[0]).toMatchObject({ plan: 'Day pass · $10', status: 'Paid', detail: 'Bought Oct 20, 2026' });
  });

  it('reads dates on the Michigan clock', () => {
    // 2 AM UTC on Nov 21 is still Nov 20 in Michigan.
    expect(members([], [pay({ covers_until: '2026-11-21T02:00:00Z' })])[0].detail).toBe('Member through Nov 20, 2026');
  });
});

describe('summary', () => {
  it('lists current members first, then by name', () => {
    const rows = members(
      [
        sub({ id: 'a', status: 'canceled', profiles: { display_name: 'Aaron', email: null }, user_id: 'a' }),
        sub({ id: 'z', profiles: { display_name: 'Zed', email: null }, user_id: 'z' }),
      ],
      [pay({ id: 'b', profiles: { display_name: 'Bea', email: null } })],
    );
    expect(rows.map((r) => r.name)).toEqual(['Bea', 'Zed', 'Aaron']);
  });

  it('counts a person once however many payments they have', () => {
    const result = buildMemberRows(
      [sub({ user_id: 'u2' })],
      [pay({ id: 'p1' }), pay({ id: 'p2' }), pay({ id: 'p3', user_id: 'u9' })],
      NOW,
    );
    expect(result.members).toHaveLength(4);
    expect(result.currentCount).toBe(2);
  });

  it("doesn't count expired months or canceled subscriptions", () => {
    const result = buildMemberRows(
      [sub({ status: 'canceled' })],
      [pay({ covers_until: '2026-01-01T15:00:00Z' })],
      NOW,
    );
    expect(result.currentCount).toBe(0);
  });
});
