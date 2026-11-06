import { describe, it, expect } from 'vitest';
import { parseDate, squareDay, subscriptionOutlook, todayISO, type OutlookInput } from './subscriptionOutlook';

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

  it('reads a Square date stored as midnight UTC as that same day', () => {
    const d = parseDate('2026-12-01T00:00:00+00:00');
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 11, 1]);
  });

  it('leaves real timestamps alone', () => {
    expect(parseDate('2026-12-01T15:30:00+00:00').getTime()).toBe(Date.UTC(2026, 11, 1, 15, 30));
  });
});

describe('squareDay', () => {
  it('recognizes plain dates and midnight UTC, as the database returns them', () => {
    expect(squareDay('2026-12-01')).toBe('2026-12-01');
    expect(squareDay('2026-12-01T00:00:00+00:00')).toBe('2026-12-01');
    expect(squareDay('2026-12-01T00:00:00Z')).toBe('2026-12-01');
    expect(squareDay('2026-12-01T00:00:00.000Z')).toBe('2026-12-01');
  });

  it('treats anything else as a real timestamp', () => {
    expect(squareDay('2026-12-01T15:30:00+00:00')).toBeNull();
    expect(squareDay('2026-12-01T00:00:01+00:00')).toBeNull();
    expect(squareDay('2026-12-01T00:00:00-05:00')).toBeNull();
    expect(squareDay('not a date')).toBeNull();
  });
});

describe('todayISO', () => {
  it('formats the local date', () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
