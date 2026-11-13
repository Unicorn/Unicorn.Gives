/**
 * Name the web entry bundle after its actual contents.
 *
 * With async routes, the entry bundle carries the map from every route to its
 * chunk file (`[id]-<hash>.js`, ...). Expo names the entry before those chunk
 * paths are filled in, so `entry-<hash>.js` keeps the same name when only a
 * route changes. deploy.sh serves `_expo/` as immutable for a year, so a
 * browser that loaded the site once keeps the old entry forever: it runs old
 * screens, and once `--delete` removes the old chunks, it requests files that
 * no longer exist and the page breaks. (Found on 2026-11-12: the admin kept
 * showing the pre-tiers Square tab after a deploy.)
 *
 * Runs right after `expo export`: renames each entry bundle to a hash of its
 * final contents and rewrites the HTML pages that load it. verify-static-output
 * fails the build if an entry name doesn't match its contents.
 */

import { readdirSync, readFileSync, renameSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { entryContentName, ENTRY_PATTERN } from '../lib/entryBundle';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const jsDir = join(distDir, '_expo', 'static', 'js', 'web');

function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) htmlFiles(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function main() {
  if (!existsSync(jsDir)) {
    console.error(`[hash-entry-bundle] ${jsDir} not found`);
    process.exit(1);
  }

  const renames = new Map<string, string>();
  for (const name of readdirSync(jsDir)) {
    if (!ENTRY_PATTERN.test(name)) continue;
    const next = entryContentName(name, readFileSync(join(jsDir, name), 'utf-8'));
    if (next !== name) renames.set(name, next);
  }
  if (renames.size === 0) {
    console.log('[hash-entry-bundle] entry bundles already named by content');
    return;
  }

  let pages = 0;
  for (const file of htmlFiles(distDir)) {
    const html = readFileSync(file, 'utf-8');
    let updated = html;
    for (const [from, to] of renames) updated = updated.split(from).join(to);
    if (updated !== html) {
      writeFileSync(file, updated);
      pages++;
    }
  }
  for (const [from, to] of renames) renameSync(join(jsDir, from), join(jsDir, to));

  console.log(
    `[hash-entry-bundle] ${[...renames].map(([a, b]) => `${a} -> ${b}`).join(', ')} (${pages} pages updated)`,
  );
}

main();
