/**
 * Live labels for the partner menu bar: the "Open now" badge and the
 * next-event teaser. Pure functions of (data, now) so they are unit-tested
 * and can run only after mount — the static export never renders a
 * time-dependent label, so hydration has nothing to disagree about.
 */

export interface LocalClock {
	/** YYYY-MM-DD in the partner's time zone. */
	date: string;
	/** Minutes since local midnight. */
	minutes: number;
}

/** Wall-clock date and time in `timeZone`, falling back to device time. */
export function localClock(now: Date, timeZone: string): LocalClock {
	try {
		const parts = new Intl.DateTimeFormat("en-US", {
			timeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h23",
		}).formatToParts(now);
		const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
		const hour = Number(get("hour")) % 24;
		return {
			date: `${get("year")}-${get("month")}-${get("day")}`,
			minutes: hour * 60 + Number(get("minute")),
		};
	} catch {
		const pad = (n: number) => String(n).padStart(2, "0");
		return {
			date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
			minutes: now.getHours() * 60 + now.getMinutes(),
		};
	}
}

export interface DailyHours {
	open: number;
	close: number;
}

const TIME = String.raw`(\d{1,2})(?::(\d{2}))?\s*(AM|PM)`;
const RANGE = new RegExp(`${TIME}\\s*[–—-]\\s*${TIME}\\s*daily`, "i");

function toMinutes(h: string, m: string | undefined, meridiem: string): number {
	const hour = (Number(h) % 12) + (meridiem.toUpperCase() === "PM" ? 12 : 0);
	return hour * 60 + Number(m ?? 0);
}

/**
 * Daily public hours from free text such as
 * "**Public Welcome:** 10 AM – 2 PM Daily". Returns null when the text has no
 * single daily range we can trust — the badge is then simply not shown.
 */
export function parseDailyHours(text: string | null | undefined): DailyHours | null {
	if (!text) return null;
	const m = text.match(RANGE);
	if (!m) return null;
	const open = toMinutes(m[1], m[2], m[3]);
	const close = toMinutes(m[4], m[5], m[6]);
	return close > open ? { open, close } : null;
}

export function formatClock(minutes: number): string {
	const h24 = Math.floor(minutes / 60) % 24;
	const m = minutes % 60;
	const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
	const suffix = h24 < 12 ? "AM" : "PM";
	return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export interface OpenStatus {
	open: boolean;
	label: string;
}

export function getOpenStatus(hours: DailyHours, minutes: number): OpenStatus {
	if (minutes >= hours.open && minutes < hours.close) {
		return { open: true, label: `Open now · until ${formatClock(hours.close)}` };
	}
	const when = minutes < hours.open ? "" : " tomorrow";
	return { open: false, label: `Opens ${formatClock(hours.open)}${when}` };
}

/**
 * Short teaser for an event happening today or tomorrow, e.g.
 * "Game Night tonight". Anything further out returns null — the menu only
 * calls out what is imminent.
 */
export function eventTeaser(
	event: { title: string; date: string; time?: string | null },
	today: string,
): string | null {
	const tomorrow = addDays(today, 1);
	if (event.date !== today && event.date !== tomorrow) return null;
	const evening = /\b([5-9]|1[01])(?::\d{2})?\s*PM\b/i.test(event.time ?? "");
	const when = event.date === today ? (evening ? "tonight" : "today") : "tomorrow";
	return `${event.title} ${when}`;
}

function addDays(date: string, days: number): string {
	const d = new Date(`${date}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}
