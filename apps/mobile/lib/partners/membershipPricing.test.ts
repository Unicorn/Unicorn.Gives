import { describe, it, expect } from 'vitest';
import { cachedTiers, formatDollars, parseDollars, summaryLine } from './membershipPricing';

describe('formatDollars', () => {
	it('drops cents for whole dollars', () => {
		expect(formatDollars(2_000)).toBe('$20');
		expect(formatDollars(1_250)).toBe('$12.50');
	});
});

describe('summaryLine', () => {
	it('describes monthly and one-time payments for a tier', () => {
		const couple = { name: 'Couple', amount_cents: 8_000 };
		expect(summaryLine('monthly', couple)).toBe('Couple: $80 every month. Change or cancel anytime.');
		expect(summaryLine('one_time', couple)).toBe('Couple: $80 once for a month of membership. Nothing renews.');
	});
});

describe('cachedTiers', () => {
	const row = (id: string, name: string, plan: string, amount?: number) => ({
		square_id: id,
		display_name: name,
		data: {
			subscription_plan_variation_data: {
				subscription_plan_id: plan,
				phases: [{ cadence: 'MONTHLY', pricing: amount ? { type: 'STATIC', price_money: { amount } } : { type: 'RELATIVE' } }],
			},
		},
	});

	it('lists the membership plan’s tiers, cheapest first, and skips other plans', () => {
		expect(cachedTiers([row('V2', 'Couple', 'P', 8_000), row('V1', 'Individual', 'P', 5_000), row('X', 'Other', 'Q', 100)], 'P')).toEqual([
			{ id: 'V1', name: 'Individual', amount_cents: 5_000 },
			{ id: 'V2', name: 'Couple', amount_cents: 8_000 },
		]);
	});

	it('shows a tier without a fixed price as unpriced', () => {
		expect(cachedTiers([row('V', 'Items', 'P')], 'P')).toEqual([{ id: 'V', name: 'Items', amount_cents: null }]);
	});
});

describe('parseDollars', () => {
	it('reads typed prices', () => {
		expect(parseDollars('50')).toBe(5_000);
		expect(parseDollars(' $1,000 ')).toBe(100_000);
		expect(parseDollars('49.5')).toBe(4_950);
		expect(parseDollars('abc')).toBeNull();
		expect(parseDollars('')).toBeNull();
	});
});
