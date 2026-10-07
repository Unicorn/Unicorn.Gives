/**
 * Loaded by pnpm before dependency resolution. Fails `pnpm install` early —
 * before the lockfile can be rewritten — when the packages/ui git submodule
 * is not initialized. Without this, the "packages/*" workspace glob silently
 * matches nothing (empty dir) and pnpm drops @scaffald/ui from the lockfile.
 * Checks the filesystem, not git, so it also works where git is unavailable.
 */

const { existsSync } = require('node:fs');
const { join } = require('node:path');

const submodulePackageJson = join(__dirname, 'packages', 'ui', 'package.json');

if (!existsSync(submodulePackageJson)) {
  throw new Error(
    'packages/ui is empty — the @scaffald/ui git submodule is not initialized.\n' +
      'Run: git submodule update --init\n' +
      'Then re-run: pnpm install',
  );
}

module.exports = {};
