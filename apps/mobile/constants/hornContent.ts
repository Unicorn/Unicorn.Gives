/**
 * Static content constants extracted from real content pages:
 * - content/pages/about-the-horn.md
 * - content/pages/membership.md
 * - content/pages/hours-horn.md
 *
 * These are curated excerpts for widget display — not full page replicas.
 */

export const HORN_HERO = {
	eyebrow: "The Heart of Unicorn Gives",
	title: "The Community Center: The Horn",
	description:
		"The Horn is a nonprofit community space designed to bring people together. Housed in the historic former Lake George Grocery building, The Horn is a place to connect, host gatherings, attend events, and simply spend time in good company — a space rooted in belonging.",
	ctaLabel: "Join the Community",
	secondaryCtaLabel: "Explore The Horn",
} as const;

export const HORN_MISSION =
	"Our Mission is to foster a resilient, connected Northern community by providing a safe, upscale, and inclusive haven for collaboration and leisure.";

export const HORN_QUOTE = {
	quote:
		"Give people a place where they belong — a place that feels like home, even before you walk through the door.",
	attribution: "The Horn, Lake George",
} as const;

export const HORN_PERKS = [
	{
		key: "coffee",
		icon: "local-cafe",
		title: "Morning Coffee & Quiet Space",
		description:
			"Start the day with a coffee and a calm corner to read, work, or just be.",
		span: "full" as const,
		colorScheme: "surface" as const,
	},
	{
		key: "access",
		icon: "vpn-key",
		title: "24/7 Access",
		description:
			"Members get key access around the clock, 365 days a year. Your schedule, your space.",
		span: "half" as const,
		colorScheme: "surface" as const,
	},
	{
		key: "wifi",
		icon: "wifi",
		title: "Free Wi-Fi & Work Space",
		description:
			"Reliable Wi-Fi and a comfortable setup for remote work and projects.",
		span: "half" as const,
		colorScheme: "secondary" as const,
	},
	{
		key: "games",
		icon: "casino",
		title: "Game Nights",
		description:
			"Board games, video games, and regular game nights for friendly competition.",
		span: "half" as const,
		colorScheme: "tertiary" as const,
	},
	{
		key: "latenight",
		icon: "nightlight-round",
		title: "Late-Night Safe Hangout",
		description:
			"A safe, welcoming place to be when everywhere else is closed. No bar scene, no pressure — just good company.",
		span: "half" as const,
		colorScheme: "primary" as const,
	},
	{
		key: "lounge",
		icon: "weekend",
		title: "Members' Lounge",
		description:
			"An adults-only lounge for members only — bring your own drinks and smoke indoors.",
		span: "full" as const,
		colorScheme: "surface" as const,
	},
];

export const HORN_INFO = {
	title: "Visit The Horn",
	rows: [
		{
			icon: "place",
			label: "Location",
			value: "Historic former Lake George Grocery, Lake George, MI",
		},
		{
			icon: "schedule",
			label: "Hours",
			value: "Public Welcome: 10 AM – 2 PM Daily",
			secondaryValue: "Member Access: 24/7",
		},
		{
			icon: "card-membership",
			label: "Membership",
			value: "Pay what you can",
			secondaryValue: "Monthly or one-time · Bring one guest",
		},
		{
			icon: "confirmation-number",
			label: "Day Pass",
			value: "$10 for a full day",
		},
		{
			icon: "link",
			label: "Join",
			value: "Choose your membership",
			href: "/partners/the-horn/membership",
		},
	],
} as const;

export const COMMUNITY_SPIRIT_QUOTE = {
	quote:
		"Our community isn't just a place, it's a practice of coming together.",
	attribution: "The Unicorn Gives Spirit",
} as const;
