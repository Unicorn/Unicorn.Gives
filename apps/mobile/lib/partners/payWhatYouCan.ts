/**
 * Client-side rules for the pay-what-you-can picker. They only shape the UI
 * and give instant feedback — the square-subscriptions edge function
 * re-validates every amount (`supabase/functions/_shared/flexPricing.ts`).
 */

export type MembershipFrequency = 'monthly' | 'one_time';

/** Preset buttons: $10 to $100 in $10 steps. */
export const AMOUNT_PRESETS_CENTS = Array.from({ length: 10 }, (_, i) => (i + 1) * 1_000);

export const MIN_CUSTOM_CENTS = 1_000;
export const MAX_CUSTOM_CENTS = 100_000;
export const DAY_PASS_CENTS = 1_000;

export function formatDollars(cents: number): string {
	return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}

/** Parse the "Other amount" box ("25", "$25", "25.50") into cents. */
export function parseCustomAmount(text: string): { cents: number } | { error: string } {
	const cleaned = text.replace(/[$,\s]/g, '');
	if (!cleaned) return { error: 'Enter an amount' };
	if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return { error: 'Enter a dollar amount, like 25' };
	const cents = Math.round(Number(cleaned) * 100);
	if (cents < MIN_CUSTOM_CENTS) return { error: 'The minimum is $10' };
	if (cents > MAX_CUSTOM_CENTS) return { error: 'The maximum online is $1,000' };
	return { cents };
}

export function summaryLine(frequency: MembershipFrequency, cents: number): string {
	return frequency === 'monthly'
		? `${formatDollars(cents)} every month. Change or cancel anytime.`
		: `${formatDollars(cents)} once for a month of membership. Nothing renews.`;
}
