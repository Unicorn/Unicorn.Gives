import type { Href } from "expo-router";
import { paths, toHref } from "./paths";

/**
 * Maps CMS / legacy markdown paths to in-app Expo Router hrefs.
 * Returns null when the URL should be opened with Linking (e.g. external).
 */
export function contentPathToAppHref(path: string): Href | null {
	const p = path.split("?")[0].split("#")[0];
	if (!p.startsWith("/")) return null;

	if (p.startsWith("/home/")) return toHref(p);

	if (p === "/news") return toHref(paths.community.news);
	if (p.startsWith("/news/")) {
		const rest = p.slice("/news/".length).replace(/\/$/, "");
		const slug = rest.split("/")[0];
		if (!slug) return toHref(paths.community.news);
		return toHref(`${paths.community.news}/${encodeURIComponent(slug)}`);
	}

	if (p === "/events") return toHref(paths.community.events);
	if (p.startsWith("/events/")) {
		const rest = p.slice("/events/".length).replace(/\/$/, "");
		const slug = rest.split("/")[0];
		if (!slug) return toHref(paths.community.events);
		return toHref(`${paths.community.events}/${encodeURIComponent(slug)}`);
	}

	return null;
}
