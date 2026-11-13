/**
 * Fixed-price membership tiers (e.g. Individual / Couple / Household).
 *
 * A partner's tiers are the variations of one Square subscription plan,
 * recorded as `square_feature_config.membership_plan_id`. Each variation has
 * a single, indefinite monthly phase with a STATIC price; that price is what
 * members pay, monthly or as a one-time month. Square is the source of truth:
 * the site reads tiers from the synced catalog cache and the server prices
 * every checkout from them, never from the client.
 *
 * Square's dashboard only creates item-based (RELATIVE) plans, which payment
 * links don't document support for, so tiers are created through the Catalog
 * API (`square-sync` action `create_membership_plan`).
 *
 * No Deno or Supabase imports: also unit-tested from
 * `apps/mobile/lib/square/membershipTiers.test.ts`.
 */

export interface MembershipTier {
  /** Square plan variation id. Monthly checkouts subscribe to this. */
  id: string;
  name: string;
  amountCents: number;
}

export interface TierDraft {
  name: string;
  amountCents: number;
}

export type MembershipKind = 'monthly' | 'one_time' | 'day_pass';

/** Fixed price of a day pass. */
export const DAY_PASS_CENTS = 1_000;

export const MIN_TIER_CENTS = 100;
/** Guards against typos like $5000 for $50. */
export const MAX_TIER_CENTS = 100_000;
export const MAX_TIERS = 6;

interface Money {
  amount?: number;
  currency?: string;
}

interface Phase {
  cadence?: string;
  periods?: number;
  pricing?: { type?: string; price_money?: Money; price?: Money };
  recurring_price_money?: Money;
}

interface CachedVariation {
  square_id: string;
  is_active?: boolean | null;
  data: unknown;
}

/** The static price of a phase. Square has used three field names for it over API versions. */
export function phasePriceCents(phase: Phase | undefined): number | null {
  if (!phase) return null;
  if (phase.pricing?.type && phase.pricing.type !== 'STATIC') return null;
  const amount = phase.pricing?.price_money?.amount ??
    phase.pricing?.price?.amount ??
    phase.recurring_price_money?.amount;
  return typeof amount === 'number' && Number.isInteger(amount) && amount > 0 ? amount : null;
}

/**
 * The partner's tiers, cheapest first: active cached variations of the
 * membership plan with one indefinite, static monthly phase. Anything else
 * (other plans on a shared Square account, item-based plans, multi-phase
 * trials) is ignored rather than sold at a guessed price.
 */
export function tiersFromCatalog(rows: CachedVariation[] | null | undefined, planId: string | null | undefined): MembershipTier[] {
  if (!planId || !rows) return [];
  const tiers: MembershipTier[] = [];
  for (const row of rows) {
    if (row.is_active === false) continue;
    const obj = row.data as {
      type?: string;
      is_deleted?: boolean;
      subscription_plan_variation_data?: { name?: string; subscription_plan_id?: string; phases?: Phase[] };
    } | null;
    const v = obj?.subscription_plan_variation_data;
    if (!v || obj?.is_deleted || v.subscription_plan_id !== planId) continue;
    const phases = v.phases ?? [];
    if (phases.length !== 1 || phases[0].cadence !== 'MONTHLY' || phases[0].periods != null) continue;
    const amountCents = phasePriceCents(phases[0]);
    const name = v.name?.trim();
    if (!amountCents || !name) continue;
    tiers.push({ id: row.square_id, name, amountCents });
  }
  return tiers.sort((a, b) => a.amountCents - b.amountCents || a.name.localeCompare(b.name));
}

export type MembershipCheckout =
  | { ok: true; kind: 'day_pass'; amountCents: number; tier: null }
  | { ok: true; kind: 'monthly' | 'one_time'; amountCents: number; tier: MembershipTier }
  | { ok: false; error: string };

/** Price a checkout. Monthly and one-time need one of the partner's tiers; a day pass is fixed. */
export function validateMembershipCheckout(kind: unknown, tierId: unknown, tiers: MembershipTier[]): MembershipCheckout {
  if (kind !== 'monthly' && kind !== 'one_time' && kind !== 'day_pass') {
    return { ok: false, error: 'Choose monthly, one-time, or a day pass' };
  }
  if (kind === 'day_pass') return { ok: true, kind, amountCents: DAY_PASS_CENTS, tier: null };
  if (tiers.length === 0) return { ok: false, error: 'Memberships aren’t set up yet' };
  const tier = typeof tierId === 'string' ? tiers.find((t) => t.id === tierId) : undefined;
  if (!tier) return { ok: false, error: 'Choose a membership' };
  return { ok: true, kind, amountCents: tier.amountCents, tier };
}

/** Line-item name shown on Square's checkout page and receipt. */
export function membershipItemName(kind: MembershipKind, partnerName: string, tierName?: string | null): string {
  const what = tierName ? `${partnerName} ${tierName} membership` : `${partnerName} membership`;
  switch (kind) {
    case 'monthly':
      return `${what} (monthly)`;
    case 'one_time':
      return `${what} (one month)`;
    case 'day_pass':
      return `${partnerName} day pass`;
  }
}

/** Check tiers an admin entered before creating them in Square. */
export function validateTierDrafts(planName: unknown, drafts: unknown): { ok: true; planName: string; tiers: TierDraft[] } | { ok: false; error: string } {
  const name = typeof planName === 'string' ? planName.trim() : '';
  if (!name) return { ok: false, error: 'Name the plan' };
  if (!Array.isArray(drafts) || drafts.length === 0) return { ok: false, error: 'Add at least one tier' };
  if (drafts.length > MAX_TIERS) return { ok: false, error: `At most ${MAX_TIERS} tiers` };
  const tiers: TierDraft[] = [];
  const seen = new Set<string>();
  for (const d of drafts as Array<{ name?: unknown; amountCents?: unknown }>) {
    const tierName = typeof d?.name === 'string' ? d.name.trim() : '';
    if (!tierName) return { ok: false, error: 'Every tier needs a name' };
    if (seen.has(tierName.toLowerCase())) return { ok: false, error: `“${tierName}” is listed twice` };
    seen.add(tierName.toLowerCase());
    const cents = d?.amountCents;
    if (typeof cents !== 'number' || !Number.isInteger(cents) || cents < MIN_TIER_CENTS || cents > MAX_TIER_CENTS) {
      return { ok: false, error: `${tierName}: enter a monthly price from $1 to $1,000` };
    }
    tiers.push({ name: tierName, amountCents: cents });
  }
  return { ok: true, planName: name, tiers };
}

/**
 * Body for Square's BatchUpsertCatalogObjects: one plan and a variation per
 * tier, linked by temporary ids, so Square creates all of them or none.
 */
export function membershipPlanBatch(planName: string, tiers: TierDraft[], idempotencyKey: string) {
  const phase = (amountCents: number) => ({
    ordinal: 0,
    cadence: 'MONTHLY',
    pricing: { type: 'STATIC', price_money: { amount: amountCents, currency: 'USD' } },
  });
  return {
    idempotency_key: idempotencyKey,
    batches: [{
      objects: [
        {
          type: 'SUBSCRIPTION_PLAN',
          id: '#membership-plan',
          present_at_all_locations: true,
          subscription_plan_data: { name: planName, all_items: false },
        },
        ...tiers.map((t, i) => ({
          type: 'SUBSCRIPTION_PLAN_VARIATION',
          id: `#membership-tier-${i}`,
          present_at_all_locations: true,
          subscription_plan_variation_data: {
            name: t.name,
            subscription_plan_id: '#membership-plan',
            phases: [phase(t.amountCents)],
          },
        })),
      ],
    }],
  };
}

/** The real plan id Square assigned to `#membership-plan`. */
export function createdPlanId(response: { id_mappings?: Array<{ client_object_id?: string; object_id?: string }> }): string | null {
  return response.id_mappings?.find((m) => m.client_object_id === '#membership-plan')?.object_id ?? null;
}
