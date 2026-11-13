import { describe, it, expect } from 'vitest';
import {
  DAY_PASS_CENTS,
  createdPlanId,
  membershipItemName,
  membershipPlanBatch,
  phasePriceCents,
  tiersFromCatalog,
  validateMembershipCheckout,
  validateTierDrafts,
} from '../../../../supabase/functions/_shared/membershipTiers';

const PLAN = 'PLAN1';

function variation(
  id: string,
  name: string,
  amount: number,
  opts: { plan?: string; phases?: unknown[]; active?: boolean; deleted?: boolean } = {},
) {
  return {
    square_id: id,
    is_active: opts.active ?? true,
    data: {
      type: 'SUBSCRIPTION_PLAN_VARIATION',
      id,
      is_deleted: opts.deleted ?? false,
      subscription_plan_variation_data: {
        name,
        subscription_plan_id: opts.plan ?? PLAN,
        phases: opts.phases ?? [
          { ordinal: 0, cadence: 'MONTHLY', pricing: { type: 'STATIC', price_money: { amount, currency: 'USD' } } },
        ],
      },
    },
  };
}

describe('phasePriceCents', () => {
  it('reads every field name Square has used for a static price', () => {
    expect(phasePriceCents({ pricing: { type: 'STATIC', price_money: { amount: 5_000 } } })).toBe(5_000);
    expect(phasePriceCents({ pricing: { price: { amount: 8_000 } } })).toBe(8_000);
    expect(phasePriceCents({ recurring_price_money: { amount: 12_000 } })).toBe(12_000);
  });

  it('has no price for item-based (RELATIVE) phases or missing amounts', () => {
    expect(phasePriceCents({ pricing: { type: 'RELATIVE' } })).toBeNull();
    expect(phasePriceCents({ cadence: 'MONTHLY' })).toBeNull();
    expect(phasePriceCents(undefined)).toBeNull();
  });
});

describe('tiersFromCatalog', () => {
  it('lists the membership plan’s tiers cheapest first', () => {
    const rows = [
      variation('V3', 'Household', 12_000),
      variation('V1', 'Individual', 5_000),
      variation('V2', 'Couple', 8_000),
    ];
    expect(tiersFromCatalog(rows, PLAN)).toEqual([
      { id: 'V1', name: 'Individual', amountCents: 5_000 },
      { id: 'V2', name: 'Couple', amountCents: 8_000 },
      { id: 'V3', name: 'Household', amountCents: 12_000 },
    ]);
  });

  it('ignores other plans on a shared Square account', () => {
    const rows = [variation('V1', 'Individual', 5_000), variation('MANE', 'Basic', 2_500, { plan: 'OTHER' })];
    expect(tiersFromCatalog(rows, PLAN).map((t) => t.id)).toEqual(['V1']);
  });

  it('ignores inactive, deleted, item-based, multi-phase, fixed-length and non-monthly variations', () => {
    const rows = [
      variation('OFF', 'Old', 4_000, { active: false }),
      variation('DEL', 'Gone', 4_000, { deleted: true }),
      variation('REL', 'Items', 0, { phases: [{ cadence: 'MONTHLY', pricing: { type: 'RELATIVE' } }] }),
      variation('TRIAL', 'Trial', 0, {
        phases: [
          { cadence: 'MONTHLY', periods: 1, pricing: { type: 'STATIC', price_money: { amount: 100 } } },
          { cadence: 'MONTHLY', pricing: { type: 'STATIC', price_money: { amount: 5_000 } } },
        ],
      }),
      variation('SHORT', 'Three months', 0, {
        phases: [{ cadence: 'MONTHLY', periods: 3, pricing: { type: 'STATIC', price_money: { amount: 5_000 } } }],
      }),
      variation('YEAR', 'Annual', 0, {
        phases: [{ cadence: 'ANNUAL', pricing: { type: 'STATIC', price_money: { amount: 50_000 } } }],
      }),
    ];
    expect(tiersFromCatalog(rows, PLAN)).toEqual([]);
  });

  it('has no tiers until a membership plan is set', () => {
    expect(tiersFromCatalog([variation('V1', 'Individual', 5_000)], null)).toEqual([]);
  });
});

describe('validateMembershipCheckout', () => {
  const tiers = [
    { id: 'V1', name: 'Individual', amountCents: 5_000 },
    { id: 'V2', name: 'Couple', amountCents: 8_000 },
  ];

  it('prices monthly and one-time from the chosen tier', () => {
    expect(validateMembershipCheckout('monthly', 'V2', tiers)).toEqual({ ok: true, kind: 'monthly', amountCents: 8_000, tier: tiers[1] });
    expect(validateMembershipCheckout('one_time', 'V1', tiers)).toEqual({ ok: true, kind: 'one_time', amountCents: 5_000, tier: tiers[0] });
  });

  it('rejects an unknown or missing tier', () => {
    expect(validateMembershipCheckout('monthly', 'NOPE', tiers)).toEqual({ ok: false, error: 'Choose a membership' });
    expect(validateMembershipCheckout('one_time', undefined, tiers)).toEqual({ ok: false, error: 'Choose a membership' });
    expect(validateMembershipCheckout('monthly', 'V1', [])).toMatchObject({ ok: false });
  });

  it('charges the fixed day-pass price, needing no tier', () => {
    expect(validateMembershipCheckout('day_pass', 'V2', [])).toEqual({ ok: true, kind: 'day_pass', amountCents: DAY_PASS_CENTS, tier: null });
  });

  it('rejects unknown kinds', () => {
    expect(validateMembershipCheckout('yearly', 'V1', tiers)).toMatchObject({ ok: false });
  });
});

describe('membershipItemName', () => {
  it('names the tier on Square’s checkout page', () => {
    expect(membershipItemName('monthly', 'The Horn', 'Couple')).toBe('The Horn Couple membership (monthly)');
    expect(membershipItemName('one_time', 'The Horn', 'Individual')).toBe('The Horn Individual membership (one month)');
    expect(membershipItemName('day_pass', 'The Horn')).toBe('The Horn day pass');
  });
});

describe('validateTierDrafts', () => {
  it('accepts named tiers with monthly prices', () => {
    expect(validateTierDrafts(' The Horn Membership ', [{ name: 'Individual ', amountCents: 5_000 }])).toEqual({
      ok: true,
      planName: 'The Horn Membership',
      tiers: [{ name: 'Individual', amountCents: 5_000 }],
    });
  });

  it('rejects blank names, duplicates, bad prices and empty lists', () => {
    expect(validateTierDrafts('', [{ name: 'A', amountCents: 5_000 }])).toMatchObject({ ok: false });
    expect(validateTierDrafts('Plan', [])).toMatchObject({ ok: false });
    expect(validateTierDrafts('Plan', [{ name: ' ', amountCents: 5_000 }])).toMatchObject({ ok: false });
    expect(validateTierDrafts('Plan', [{ name: 'A', amountCents: 5_000 }, { name: 'a', amountCents: 6_000 }])).toMatchObject({ ok: false });
    expect(validateTierDrafts('Plan', [{ name: 'A', amountCents: 50.5 }])).toMatchObject({ ok: false });
    expect(validateTierDrafts('Plan', [{ name: 'A', amountCents: 500_000 }])).toMatchObject({ ok: false });
  });
});

describe('membershipPlanBatch', () => {
  it('creates the plan and one static monthly variation per tier in a single batch', () => {
    const body = membershipPlanBatch('The Horn Membership', [
      { name: 'Individual', amountCents: 5_000 },
      { name: 'Couple', amountCents: 8_000 },
    ], 'key-1');
    expect(body.idempotency_key).toBe('key-1');
    const [plan, ...variations] = body.batches[0].objects;
    expect(plan).toMatchObject({ type: 'SUBSCRIPTION_PLAN', id: '#membership-plan', subscription_plan_data: { name: 'The Horn Membership' } });
    expect(variations).toHaveLength(2);
    expect(variations[1]).toMatchObject({
      type: 'SUBSCRIPTION_PLAN_VARIATION',
      subscription_plan_variation_data: {
        name: 'Couple',
        subscription_plan_id: '#membership-plan',
        phases: [{ cadence: 'MONTHLY', pricing: { type: 'STATIC', price_money: { amount: 8_000, currency: 'USD' } } }],
      },
    });
  });

  it('finds the real plan id in Square’s response', () => {
    expect(createdPlanId({ id_mappings: [
      { client_object_id: '#membership-tier-0', object_id: 'V1' },
      { client_object_id: '#membership-plan', object_id: 'PLAN1' },
    ] })).toBe('PLAN1');
    expect(createdPlanId({})).toBeNull();
  });
});
