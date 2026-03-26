const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
// `__dirname` is `apps/mobile`, so the monorepo root is `../..`.
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the Scaffald UI submodule for changes
config.watchFolders = [path.resolve(monorepoRoot, 'packages/ui')];

// Resolve modules from the app's node_modules first, then monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
