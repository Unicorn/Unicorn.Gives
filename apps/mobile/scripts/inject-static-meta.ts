/**
 * Write per-route SEO metadata into the exported HTML.
 *
 * `expo export` currently emits the same shell for every route (see
 * generate-route-meta.ts for why), so without this every page shares one title
 * and one description. This runs after the export and rewrites each page's
 * <head> using the map built by generate-route-meta.ts.
 *
 * Only <head> is touched. The React root in <body> is left byte-identical, so
 * this cannot introduce a hydration mismatch.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const metaPath = join(__dirname, '..', 'lib', 'route-meta-data.json');
const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL ?? 'https://unicorn.gives').replace(/\/$/, '');
const SITE_NAME = 'UNI Gives';

type RouteMeta = {
  title: string;
  description?: string;
  image?: string | null;
  jsonLd?: Record<string, unknown>;
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

/** dist/(tabs)/guides/dog-license.html -> /guides/dog-license */
function routeForFile(file: string): string {
  let rel = relative(distDir, file).split(sep).join('/');
  rel = rel.replace(/\.html$/, '');
  rel = rel.replace(/\/index$/, '');
  if (rel === 'index') rel = '';
  // Expo Router groups like (tabs) and (auth) do not appear in URLs.
  rel = rel
    .split('/')
    .filter((seg) => !/^\(.*\)$/.test(seg))
    .join('/');
  return `/${rel}`.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
}

function absolute(url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  if (/^https?:\/\//.test(url)) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** Signed-in-only surfaces are exported as empty shells; keep them out of search. */
function isPrivateRoute(route: string): boolean {
  return /^\/(admin|user|sign-in|sign-up|\+not-found|_sitemap)(\/|$)/.test(route);
}

function headBlock(route: string, meta: RouteMeta): string {
  const title = `${meta.title} · ${SITE_NAME}`;
  const canonical = `${SITE_URL}${route === '/' ? '/' : route}`;
  const img = absolute(meta.image);
  const parts = [
    `<title>${esc(title)}</title>`,
    `<link rel="canonical" href="${esc(canonical)}"/>`,
    `<meta property="og:title" content="${esc(title)}"/>`,
    `<meta property="og:url" content="${esc(canonical)}"/>`,
    `<meta name="twitter:card" content="${img ? 'summary_large_image' : 'summary'}"/>`,
    `<meta name="twitter:title" content="${esc(title)}"/>`,
  ];
  if (isPrivateRoute(route)) {
    parts.push('<meta name="robots" content="noindex,nofollow"/>');
  }
  if (meta.description) {
    parts.push(
      `<meta name="description" content="${esc(meta.description)}"/>`,
      `<meta property="og:description" content="${esc(meta.description)}"/>`,
      `<meta name="twitter:description" content="${esc(meta.description)}"/>`,
    );
  }
  if (img) {
    parts.push(
      `<meta property="og:image" content="${esc(img)}"/>`,
      `<meta name="twitter:image" content="${esc(img)}"/>`,
    );
  }
  if (meta.jsonLd) {
    // `<` is escaped so a stray "</script>" in the data cannot close the tag.
    const json = JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c');
    parts.push(`<script type="application/ld+json">${json}</script>`);
  }
  return `<!--static-meta-->${parts.join('')}<!--/static-meta-->`;
}

function main() {
  if (!existsSync(distDir)) {
    console.error(`[inject-static-meta] dist not found at ${distDir}`);
    process.exit(1);
  }
  if (!existsSync(metaPath)) {
    console.warn('[inject-static-meta] No route metadata; skipping.');
    return;
  }

  const { routes } = JSON.parse(readFileSync(metaPath, 'utf-8')) as {
    routes: Record<string, RouteMeta>;
  };
  if (!routes || Object.keys(routes).length === 0) {
    console.warn('[inject-static-meta] Route metadata is empty; skipping.');
    return;
  }

  let injected = 0;
  let skipped = 0;

  for (const file of walk(distDir)) {
    const route = routeForFile(file);
    let meta = routes[route];
    if (!meta && isPrivateRoute(route)) {
      // No title worth inventing, but these must still be marked noindex.
      meta = { title: SITE_NAME };
    }
    if (!meta) {
      skipped++;
      continue;
    }

    let html = readFileSync(file, 'utf-8');
    // Drop the shared default description so it cannot win over ours.
    html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/i, '');
    html = html.replace(/<!--static-meta-->[\s\S]*?<!--\/static-meta-->/, '');

    const block = headBlock(route, meta);
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${block}</head>`);
    } else {
      console.warn(`[inject-static-meta] No </head> in ${file}; skipping.`);
      continue;
    }

    writeFileSync(file, html, 'utf-8');
    injected++;
  }

  console.log(
    `[inject-static-meta] Injected metadata into ${injected} pages (${skipped} without metadata).`,
  );
}

main();
