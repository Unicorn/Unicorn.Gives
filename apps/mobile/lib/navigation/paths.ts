import type { Href } from "expo-router";

export function toHref(path: string): Href {
	return path as Href;
}

export function hrefToPathString(href: Href): string {
	if (typeof href === "string") return href;
	if (typeof href === "object" && href !== null && "pathname" in href) {
		return String((href as { pathname: string }).pathname);
	}
	return String(href);
}

export const paths = {
	home: "/",
	homeDiscover: "/home",
	auth: {
		signIn: "/sign-in",
		signUp: "/sign-up",
		admin: "/admin",
	},
	admin: {
		events: "/admin/events",
		news: "/admin/news",
	},
	user: {
		index: "/user",
		profile: "/user/profile",
		settings: "/user/settings",
	},
	history: { index: "/home/history" },
	community: {
		index: "/home/community",
		events: "/home/events",
		news: "/home/news",
	},
	government: { base: "/government" },
	partners: { base: "/partners" },
} as const;

export const municipalSubsegments = {
	minutes: "minutes",
	ordinances: "ordinances",
	contacts: "contacts",
	elections: "elections",
	events: "events",
} as const;

export type MunicipalSubsegment =
	(typeof municipalSubsegments)[keyof typeof municipalSubsegments];

const MUNICIPAL_DETAIL_RE = new RegExp(
	"/government/[^/]+/[^/]+/(?:" +
		Object.values(municipalSubsegments).join("|") +
		")/[^/]+$",
);

export function isMunicipalDetailPath(pathname: string): boolean {
	return MUNICIPAL_DETAIL_RE.test(pathname);
}

function enc(s: string): string {
	return encodeURIComponent(s);
}

function municipalityBase(countySlug: string, municipalitySlug: string) {
	return (
		paths.government.base + "/" + enc(countySlug) + "/" + enc(municipalitySlug)
	);
}

export const routes = {
	home: () => toHref(paths.home),
	auth: {
		signIn: () => toHref(paths.auth.signIn),
		signUp: () => toHref(paths.auth.signUp),
		adminDashboard: () => toHref(paths.auth.admin),
	},
	admin: {
		eventsIndex: () => toHref(paths.admin.events),
		newsIndex: () => toHref(paths.admin.news),
		newEvent: () => toHref(`${paths.admin.events}/new`),
		newNews: () => toHref(`${paths.admin.news}/new`),
		editEvent: (id: string) => toHref(`${paths.admin.events}/${enc(id)}`),
		editNews: (id: string) => toHref(`${paths.admin.news}/${enc(id)}`),
	},
	user: {
		index: () => toHref(paths.user.index),
		profile: () => toHref(paths.user.profile),
		settings: () => toHref(paths.user.settings),
	},
	history: {
		index: () => toHref(paths.history.index),
		detail: (slug: string) => toHref(paths.history.index + "/" + enc(slug)),
	},
	community: {
		index: () => toHref(paths.community.index),
		events: {
			index: () => toHref(paths.community.events),
			detail: (slug: string) =>
				toHref(paths.community.events + "/" + enc(slug)),
		},
		news: {
			index: () => toHref(paths.community.news),
			detail: (slug: string) => toHref(paths.community.news + "/" + enc(slug)),
		},
	},
	partners: {
		index: (partnerSlug: string) =>
			toHref(paths.partners.base + "/" + enc(partnerSlug)),
		tab: (partnerSlug: string, tabSlug: string) =>
			toHref(paths.partners.base + "/" + enc(partnerSlug) + "/" + enc(tabSlug)),
		tabItems: (
			partnerSlug: string,
			tabs: { label: string; slug: string; order: number }[],
		): { label: string; href: Href }[] => {
			const sorted = [...tabs].sort((a, b) => a.order - b.order);
			return sorted.map((t, i) => ({
				label: t.label,
				href:
					i === 0
						? routes.partners.index(partnerSlug)
						: routes.partners.tab(partnerSlug, t.slug),
			}));
		},
	},
	government: {
		county: (countySlug: string) =>
			toHref(paths.government.base + "/" + enc(countySlug)),
		municipality: (countySlug: string, municipalitySlug: string) =>
			toHref(municipalityBase(countySlug, municipalitySlug)),
		minutes: {
			index: (countySlug: string, municipalitySlug: string) =>
				toHref(municipalityBase(countySlug, municipalitySlug) + "/minutes"),
			detail: (
				countySlug: string,
				municipalitySlug: string,
				minuteSlug: string,
			) =>
				toHref(
					municipalityBase(countySlug, municipalitySlug) +
						"/minutes/" +
						enc(minuteSlug),
				),
		},
		ordinances: {
			index: (countySlug: string, municipalitySlug: string) =>
				toHref(municipalityBase(countySlug, municipalitySlug) + "/ordinances"),
			detail: (
				countySlug: string,
				municipalitySlug: string,
				ordinanceSlug: string,
			) =>
				toHref(
					municipalityBase(countySlug, municipalitySlug) +
						"/ordinances/" +
						enc(ordinanceSlug),
				),
		},
		contacts: {
			index: (countySlug: string, municipalitySlug: string) =>
				toHref(municipalityBase(countySlug, municipalitySlug) + "/contacts"),
			detail: (
				countySlug: string,
				municipalitySlug: string,
				contactSlug: string,
			) =>
				toHref(
					municipalityBase(countySlug, municipalitySlug) +
						"/contacts/" +
						enc(contactSlug),
				),
		},
		elections: {
			index: (countySlug: string, municipalitySlug: string) =>
				toHref(municipalityBase(countySlug, municipalitySlug) + "/elections"),
			detail: (
				countySlug: string,
				municipalitySlug: string,
				electionSlug: string,
			) =>
				toHref(
					municipalityBase(countySlug, municipalitySlug) +
						"/elections/" +
						enc(electionSlug),
				),
		},
		events: {
			index: (countySlug: string, municipalitySlug: string) =>
				toHref(municipalityBase(countySlug, municipalitySlug) + "/events"),
			detail: (
				countySlug: string,
				municipalitySlug: string,
				eventSlug: string,
			) =>
				toHref(
					municipalityBase(countySlug, municipalitySlug) +
						"/events/" +
						enc(eventSlug),
				),
		},
		documents: {
			index: (countySlug: string, municipalitySlug: string) =>
				toHref(municipalityBase(countySlug, municipalitySlug) + "/documents"),
			detail: (
				countySlug: string,
				municipalitySlug: string,
				documentSlug: string,
			) =>
				toHref(
					municipalityBase(countySlug, municipalitySlug) +
						"/documents/" +
						enc(documentSlug),
				),
		},
		/** @deprecated Use documents.detail with slug zoning-ordinance-44 */
		zoning: (countySlug: string, municipalitySlug: string) =>
			toHref(municipalityBase(countySlug, municipalitySlug) + "/zoning"),
		municipalSubNavTabs: (
			countySlug: string,
			municipalitySlug: string,
		): { label: string; href: Href }[] => {
			const base = municipalityBase(countySlug, municipalitySlug);
			return [
				{ label: "Overview", href: toHref(base) },
				{ label: "Minutes", href: toHref(base + "/minutes") },
				{ label: "Ordinances", href: toHref(base + "/ordinances") },
				{ label: "Contacts", href: toHref(base + "/contacts") },
				{ label: "Events", href: toHref(base + "/events") },
				{ label: "Elections", href: toHref(base + "/elections") },
			];
		},
	},
} as const;

export function isPathActive(pathname: string, href: Href): boolean {
	const target = href as string;
	if (target === paths.home) {
		return pathname === paths.home;
	}
	return pathname === target || pathname.startsWith(target + "/");
}
