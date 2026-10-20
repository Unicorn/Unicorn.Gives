/**
 * Partners whose landing and tab pages use the branded `PartnerMenuBar`
 * instead of plain `SubTabs`. Menu items still come from the partner's own
 * tabs (so admins add or reorder them in data); this only relabels, hides
 * and decorates them.
 */
export interface PartnerMenuConfig {
	/** Tab slugs left out of the menu — e.g. `about`, which Home already covers. */
	hidden?: string[];
	/** Menu labels by tab slug, overriding the tab's own label. */
	labels?: Record<string, string>;
	/** Shorter labels for the phone layout. */
	shortLabels?: Record<string, string>;
	/** Tab the Join button opens; omit to hide Join. */
	joinTab?: string;
	/** `events.category` used for the next-event teaser on the events tab. */
	eventCategory?: string;
	/** IANA zone the partner's hours are written in. */
	timeZone: string;
}

export const PARTNER_MENUS: Record<string, PartnerMenuConfig> = {
	"the-horn": {
		hidden: ["about"],
		labels: { hours: "Visit", host: "Host an event" },
		shortLabels: { host: "Host" },
		joinTab: "membership",
		eventCategory: "horn",
		timeZone: "America/Detroit",
	},
};

export function getPartnerMenu(slug: string | undefined): PartnerMenuConfig | null {
	return (slug && PARTNER_MENUS[slug]) || null;
}
