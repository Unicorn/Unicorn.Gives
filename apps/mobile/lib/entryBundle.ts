/**
 * Content-hash naming for the web entry bundle (see scripts/hash-entry-bundle.ts).
 * Build-time only: never imported by app code.
 */
import { createHash } from 'node:crypto';

/** Expo's web entry bundle: `entry-<32 hex>.js`. */
export const ENTRY_PATTERN = /^entry-[0-9a-f]{32}\.js$/;

/** The name an entry bundle should have given its contents. */
export function entryContentName(name: string, contents: string): string {
  if (!ENTRY_PATTERN.test(name)) return name;
  const hash = createHash('sha256').update(contents).digest('hex').slice(0, 32);
  return `entry-${hash}.js`;
}
