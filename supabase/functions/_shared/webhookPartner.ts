/**
 * Which partners a Square webhook event belongs to.
 *
 * Several partners can share one Square seller account, one location each
 * (The Horn and The Mane do), so the event's merchant id alone can match
 * more than one connection. Events tied to a location (orders,
 * subscriptions, invoices, bookings) go to the partner on that location, or
 * to nobody if it's a location no partner uses. Merchant-wide events
 * (customers, catalog) go to every partner on the account.
 *
 * No Deno or Supabase imports: also unit-tested from
 * `apps/mobile/lib/square/webhookPartner.test.ts`.
 */

export interface MerchantConnection {
  partner_id: string;
  location_id: string | null;
}

/** The location an event's object is tied to, if it has one. */
export function eventLocationId(object: Record<string, unknown> | undefined): string | null {
  if (!object) return null;
  for (const key of ['order_updated', 'order_created', 'order', 'subscription', 'invoice', 'booking']) {
    const value = object[key] as { location_id?: unknown } | undefined;
    if (value && typeof value.location_id === 'string' && value.location_id) return value.location_id;
  }
  return null;
}

export function partnersForEvent(connections: MerchantConnection[], locationId: string | null): string[] {
  if (!locationId) return connections.map((c) => c.partner_id);
  return connections.filter((c) => c.location_id === locationId).map((c) => c.partner_id);
}
