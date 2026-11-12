import { describe, it, expect } from 'vitest';
import { eventLocationId, partnersForEvent } from '../../../../supabase/functions/_shared/webhookPartner';

const SHARED = [
  { partner_id: 'horn', location_id: 'L_HORN' },
  { partner_id: 'mane', location_id: 'L_MANE' },
];

describe('eventLocationId', () => {
  it('reads the location from each kind of event object', () => {
    expect(eventLocationId({ order_updated: { order_id: 'o', location_id: 'L_HORN' } })).toBe('L_HORN');
    expect(eventLocationId({ subscription: { id: 's', location_id: 'L_HORN' } })).toBe('L_HORN');
    expect(eventLocationId({ invoice: { id: 'i', location_id: 'L_HORN' } })).toBe('L_HORN');
    expect(eventLocationId({ booking: { id: 'b', location_id: 'L_MANE' } })).toBe('L_MANE');
  });

  it('returns null for merchant-wide events', () => {
    expect(eventLocationId({ customer: { id: 'c' } })).toBeNull();
    expect(eventLocationId(undefined)).toBeNull();
    expect(eventLocationId({ booking: { id: 'b', location_id: '' } })).toBeNull();
  });
});

describe('partnersForEvent', () => {
  it('sends a located event only to the partner on that location', () => {
    expect(partnersForEvent(SHARED, 'L_HORN')).toEqual(['horn']);
    expect(partnersForEvent(SHARED, 'L_MANE')).toEqual(['mane']);
  });

  it('drops an event for a location no partner uses', () => {
    expect(partnersForEvent(SHARED, 'L_UNICORN')).toEqual([]);
  });

  it('sends a merchant-wide event to every partner on the account', () => {
    expect(partnersForEvent(SHARED, null)).toEqual(['horn', 'mane']);
  });

  it('still works with one partner per account', () => {
    expect(partnersForEvent([{ partner_id: 'solo', location_id: 'L1' }], 'L1')).toEqual(['solo']);
    expect(partnersForEvent([{ partner_id: 'solo', location_id: 'L1' }], null)).toEqual(['solo']);
  });
});
