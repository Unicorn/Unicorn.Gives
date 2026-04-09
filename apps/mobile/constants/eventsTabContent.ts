/** Hero copy for Home → Events and Home → News tabs (hrefs wired in screens). */

export const EVENTS_TAB_HERO = {
	eyebrow: "Community calendar",
	headline: "Community Events",
	headlineAccent: "& Gatherings",
	subheadline:
		"Workshops, board meetings, gatherings at The Horn, and conservation outings — filter by category or browse the full list.",
	ctaLabel: "The Horn",
	secondaryCtaLabel: "Get involved",
	/** Fallback hero image for events pages without a region image. */
	imageUrl:
		"https://kifhbevwmpqdeuxqnjxa.supabase.co/storage/v1/object/public/assets/events/events-hero.jpg",
} as const;

export const NEWS_TAB_HERO = {
	eyebrow: "Civic pulse",
	title: "News & updates",
	description:
		"Civic stories, county perspectives, and what is happening across Clare County and northern Michigan communities.",
	ctaLabel: "Browse events",
	secondaryCtaLabel: "The Horn",
} as const;
