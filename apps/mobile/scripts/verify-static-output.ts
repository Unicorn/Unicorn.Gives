/**
 * Assert the static export is actually usable before it can be deployed.
 *
 * This exists because each of these failures shipped silently and was found by
 * hand, long after the fact:
 *  - every exported page was byte-identical, with no per-page <title>, while
 *    sitemap.xml advertised those URLs to search engines;
 *  - clean URLs resolved to the home page because the flat route aliases were
 *    missing;
 *  - the route aliaser wrote a stray file outside the output directory;
 *  - the entry bundle kept its name while its contents changed, so browsers
 *    holding it as immutable ran old screens against deleted chunks.
 *
 * A failing build is noisy and cheap. A silent bad deploy is neither.
 */

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { ENTRY_PATTERN, entryContentName } from "../lib/entryBundle";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, "..");
const distDir = join(appDir, "dist");

/** Pages that legitimately have no title or are never served directly. */
const EXEMPT = /(^|\/)(_sitemap|\+not-found)\.html$/;

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (entry.endsWith(".html")) out.push(full);
	}
	return out;
}

function main() {
	const failures: string[] = [];

	if (!existsSync(distDir)) {
		console.error("[verify-static-output] dist/ not found");
		process.exit(1);
	}

	const files = walk(distDir);
	if (files.length === 0) {
		console.error("[verify-static-output] dist/ contains no HTML");
		process.exit(1);
	}

	// 1. Pages must not all be the same shell.
	const digests = new Set(
		files.map((f) => createHash("md5").update(readFileSync(f, "utf-8")).digest("hex")),
	);
	const distinctRatio = digests.size / files.length;
	if (digests.size < 10 || distinctRatio < 0.1) {
		failures.push(
			`only ${digests.size} distinct pages across ${files.length} files — ` +
				"pre-rendering has regressed and every route is serving the same shell",
		);
	}

	// 2. Every servable page needs its own title.
	const untitled = files.filter((f) => {
		const rel = relative(distDir, f).split(sep).join("/");
		if (EXEMPT.test(rel) || rel.includes("[")) return false; // [param] files are not served
		// The injected title carries data-rh so Helmet adopts it; match any attributes
		// and require non-empty text, since Helmet leaves an empty title on gated routes.
		return !/<title[^>]*>[^<]+<\/title>/.test(readFileSync(f, "utf-8"));
	});
	if (untitled.length > 0) {
		failures.push(
			`${untitled.length} page(s) have no <title>, e.g. ` +
				untitled
					.slice(0, 3)
					.map((f) => relative(distDir, f))
					.join(", "),
		);
	}

	// 3. Route aliasing must stay inside dist/.
	const stray = join(appDir, "dist.html");
	if (existsSync(stray)) {
		failures.push("dist.html was written outside the output directory");
	}

	// 4. Every sitemap URL must resolve to a file CloudFront can serve.
	const sitemap = join(distDir, "sitemap.xml");
	if (existsSync(sitemap)) {
		const locs = [
			...readFileSync(sitemap, "utf-8").matchAll(/<loc>([^<]+)<\/loc>/g),
		].map((m) => m[1]);
		const missing = locs.filter((loc) => {
			const path = loc.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
			if (!path) return false; // root
			return (
				!existsSync(join(distDir, `${path}.html`)) &&
				!existsSync(join(distDir, path, "index.html"))
			);
		});
		if (missing.length > 0) {
			failures.push(
				`${missing.length} sitemap URL(s) have no exported page, e.g. ${missing.slice(0, 3).join(", ")}`,
			);
		}
	}

	// 5. The entry bundle's name must follow its contents (scripts/hash-entry-bundle.ts),
	//    and every page must load an entry that exists.
	const jsDir = join(distDir, "_expo", "static", "js", "web");
	if (existsSync(jsDir)) {
		const entries = readdirSync(jsDir).filter((n) => ENTRY_PATTERN.test(n));
		for (const name of entries) {
			const expected = entryContentName(name, readFileSync(join(jsDir, name), "utf-8"));
			if (expected !== name) {
				failures.push(`${name} is not named by its contents (expected ${expected}); run hash-entry-bundle`);
			}
		}
		const known = new Set(entries);
		const broken = files.filter((f) =>
			[...readFileSync(f, "utf-8").matchAll(/entry-[0-9a-f]{32}\.js/g)].some((m) => !known.has(m[0])),
		);
		if (broken.length > 0) {
			failures.push(
				`${broken.length} page(s) load an entry bundle that doesn't exist, e.g. ${relative(distDir, broken[0])}`,
			);
		}
	}

	if (failures.length > 0) {
		console.error("[verify-static-output] FAILED:");
		for (const f of failures) console.error(`  - ${f}`);
		process.exit(1);
	}

	console.log(
		`[verify-static-output] OK — ${files.length} pages, ${digests.size} distinct, all titled.`,
	);
}

main();
