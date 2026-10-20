import { describe, it, expect } from 'vitest';
import { parseDate, subscriptionOutlook, todayISO, type OutlookInput } from './subscriptionOutlook';

const TODAY = '2026-10-20';

function sub(overrides: Partial<OutlookInput> = {}): OutlookInput {
  return {
    status: 'active',
    canceled_at: null,
    cancel_at_period_end: false,
    scheduled_action: null,
    scheduled_action_date: null,
    ...overrides,
  };
}

describe('subscriptionOutlook', () => {
  it('shows a canceled but paid-up subscription as ending on its cancel date', () => {
    expect(subscriptionOutlook(sub({ cancel_at_period_end: true, canceled_at: '2026-11-18' }), TODAY)).toEqual({
      ending: '2026-11-18',
      pausing: null,
    });
  });

  it('treats a scheduled CANCEL as ending even before the row has a cancel date', () => {
    expect(
      subscriptionOutlook(sub({ scheduled_action: 'CANCEL', scheduled_action_date: '2026-11-18' }), TODAY).ending,
    ).toBe('2026-11-18');
  });

  it('shows a scheduled pause, but not one whose date has passed', () => {
    const pausing = sub({ scheduled_action: 'PAUSE', scheduled_action_date: '2026-11-18' });
    expect(subscriptionOutlook(pausing, TODAY).pausing).toBe('2026-11-18');
    expect(subscriptionOutlook(pausing, '2026-11-19').pausing).toBeNull();
  });

  it('says nothing for an ordinary active, paused or ended subscription', () => {
    for (const status of ['active', 'paused', 'canceled'] as const) {
      expect(subscriptionOutlook(sub({ status }), TODAY)).toEqual({ ending: null, pausing: null });
    }
  });

  it('does not call a fully canceled subscription "ending"', () => {
    expect(
      subscriptionOutlook(sub({ status: 'canceled', cancel_at_period_end: true, canceled_at: '2026-10-01' }), TODAY)
        .ending,
    ).toBeNull();
  });
});

describe('parseDate', () => {
  it('reads a plain Square date as that local calendar day', () => {
    const d = parseDate('2026-11-18');
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 10, 18]);
  });
});

describe('todayISO', () => {
  it('formats the local date', () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
