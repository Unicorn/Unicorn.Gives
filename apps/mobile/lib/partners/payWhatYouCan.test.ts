import { describe, it, expect } from 'vitest';
import { AMOUNT_PRESETS_CENTS, formatDollars, parseCustomAmount, summaryLine } from './payWhatYouCan';

describe('AMOUNT_PRESETS_CENTS', () => {
	it('runs from $10 to $100 in $10 steps', () => {
		expect(AMOUNT_PRESETS_CENTS.map((c) => c / 100)).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
	});
});

describe('parseCustomAmount', () => {
	it('accepts plain, dollar-signed and decimal amounts', () => {
		expect(parseCustomAmount('25')).toEqual({ cents: 2_500 });
		expect(parseCustomAmount(' $35 ')).toEqual({ cents: 3_500 });
		expect(parseCustomAmount('12.50')).toEqual({ cents: 1_250 });
		expect(parseCustomAmount('1,000')).toEqual({ cents: 100_000 });
	});

	it('explains what is wrong', () => {
		expect(parseCustomAmount('')).toEqual({ error: 'Enter an amount' });
		expect(parseCustomAmount('abc')).toEqual({ error: 'Enter a dollar amount, like 25' });
		expect(parseCustomAmount('9.99')).toEqual({ error: 'The minimum is $10' });
		expect(parseCustomAmount('1000.01')).toEqual({ error: 'The maximum online is $1,000' });
		expect(parseCustomAmount('10.555')).toEqual({ error: 'Enter a dollar amount, like 25' });
	});
});

describe('formatDollars', () => {
	it('drops cents for whole dollars', () => {
		expect(formatDollars(2_000)).toBe('$20');
		expect(formatDollars(1_250)).toBe('$12.50');
	});
});

describe('summaryLine', () => {
	it('describes monthly and one-time payments', () => {
		expect(summaryLine('monthly', 2_000)).toBe('$20 every month. Change or cancel anytime.');
		expect(summaryLine('one_time', 2_000)).toBe('$20 once for a month of membership. Nothing renews.');
	});
});
