import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildSitemapXml, collectPublicPathsForSitemap } from '../lib/static-build-queries';
import { getPublicSiteUrl } from '../lib/seo';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

async function main() {
  const base = getPublicSiteUrl();
  if (!base) {
    console.warn(
      '[generate-sitemap] EXPO_PUBLIC_SITE_URL is not set; using https://unicorn.gives for absolute URLs in sitemap and robots.txt.',
    );
  }
  const origin = base || 'https://unicorn.gives';

  const paths = await collectPublicPathsForSitemap();
  const absoluteUrls = paths.map((p) => `${origin}${p}`);
  const xml = buildSitemapXml(absoluteUrls);

  mkdirSync(publicDir, { recursive: true });
  writeFileSync(join(publicDir, 'sitemap.xml'), xml, 'utf-8');

  const robots = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${origin}/sitemap.xml
`;
  writeFileSync(join(publicDir, 'robots.txt'), robots, 'utf-8');

  console.log(`[generate-sitemap] Wrote ${paths.length} URLs to public/sitemap.xml`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
