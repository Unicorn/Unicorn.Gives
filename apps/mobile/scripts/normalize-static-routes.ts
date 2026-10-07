/**
 * Emit both URL shapes for every exported page.
 *
 * The S3 origin is a REST endpoint behind OAC, so it has no index-document
 * behaviour: a request for `/partners/the-mane` looks for a key of exactly that
 * name, misses, and CloudFront's 404 -> /index.html rule quietly serves the
 * home page instead. Expo emits directory routes as `X/index.html` and file
 * routes as `X.html`, so a single CloudFront rewrite rule cannot satisfy both.
 *
 * Writing the missing sibling for each page means one rule ("append .html to
 * extensionless URIs") resolves every route. Runs after `expo export` and
 * before metadata injection, so both copies get the same <head>.
 */

import { readdirSync, statSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

function main() {
  if (!existsSync(distDir)) {
    console.error(`[normalize-static-routes] dist not found at ${distDir}`);
    process.exit(1);
  }

  let created = 0;
  for (const file of walk(distDir)) {
    if (!file.endsWith(`${'/'}index.html`) && !file.endsWith('\\index.html')) continue;
    // dist/partners/the-mane/index.html -> dist/partners/the-mane.html
    const parent = dirname(file);
    // The root index has no parent route; aliasing it would write dist.html
    // *outside* the output directory.
    if (parent === distDir) continue;
    const flat = `${parent}.html`;
    if (existsSync(flat)) continue;
    copyFileSync(file, flat);
    created++;
  }

  console.log(`[normalize-static-routes] Created ${created} flat route aliases.`);
}

main();
