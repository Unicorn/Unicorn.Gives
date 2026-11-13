/**
 * Client-side helpers for the membership picker. They only shape the UI —
 * tiers and prices come from the server (`membership_options`), and the
 * square-subscriptions edge function prices every checkout itself
 * (`supabase/functions/_shared/membershipTiers.ts`).
 */

export type MembershipFrequency = 'monthly' | 'one_time';

export const DAY_PASS_CENTS = 1_000;

export function formatDollars(cents: number): string {
	return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}

export function summaryLine(frequency: MembershipFrequency, tier: { name: string; amount_cents: number }): string {
	const price = formatDollars(tier.amount_cents);
	return frequency === 'monthly'
		? `${tier.name}: ${price} every month. Change or cancel anytime.`
		: `${tier.name}: ${price} once for a month of membership. Nothing renews.`;
}

export interface CachedTier {
	id: string;
	name: string;
	amount_cents: number | null;
}

/**
 * The membership plan's tiers as cached by Sync, for the admin Square tab.
 * Mirrors `tiersFromCatalog` in supabase/functions/_shared/membershipTiers.ts
 * loosely: a tier with no readable fixed price shows with `amount_cents`
 * null, so an admin can see why the site won't sell it.
 */
export function cachedTiers(
	rows: Array<{ square_id: string; display_name: string | null; data: unknown }> | null | undefined,
	planId: string | null | undefined,
): CachedTier[] {
	if (!rows || !planId) return [];
	const tiers: CachedTier[] = [];
	for (const row of rows) {
		const v = (row.data as {
			subscription_plan_variation_data?: {
				subscription_plan_id?: string;
				phases?: Array<{
					pricing?: { type?: string; price_money?: { amount?: number }; price?: { amount?: number } };
					recurring_price_money?: { amount?: number };
				}>;
			};
		} | null)?.subscription_plan_variation_data;
		if (v?.subscription_plan_id !== planId) continue;
		const phase = v.phases?.length === 1 ? v.phases[0] : undefined;
		const amount = phase && (!phase.pricing?.type || phase.pricing.type === 'STATIC')
			? (phase.pricing?.price_money?.amount ?? phase.pricing?.price?.amount ?? phase.recurring_price_money?.amount)
			: undefined;
		tiers.push({ id: row.square_id, name: row.display_name ?? row.square_id, amount_cents: amount ?? null });
	}
	return tiers.sort((a, b) => (a.amount_cents ?? Infinity) - (b.amount_cents ?? Infinity));
}

/** Parse a dollar price typed by an admin ("50", "$50", "49.50") into cents, or null. */
export function parseDollars(text: string): number | null {
	const cleaned = text.replace(/[$,\s]/g, '');
	if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
	return Math.round(Number(cleaned) * 100);
}
