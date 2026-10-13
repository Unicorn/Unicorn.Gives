/**
 * Subset the fonts the site ships to the characters it can actually use.
 *
 * Each visitor downloaded ~1 MB of TrueType on first view: three Manrope and
 * three Newsreader faces with full Unicode coverage, plus the complete
 * MaterialIcons set (2,234 glyphs) for the ~165 icons the app references.
 *
 * - Text faces are cut to Google's "latin" range (ASCII, Latin-1, common
 *   punctuation, curly quotes, dashes, bullets, currency).
 * - MaterialIcons is cut to every glyph name that appears as a string in
 *   app/, components/, constants/, lib/ and hooks/ — code and committed
 *   snapshot data alike — so an icon referenced anywhere in the repo is kept.
 *   This runs as part of mobile:build, so a newly used icon is picked up on
 *   the next build; if the font is ever found lacking a glyph at runtime the
 *   fix is to reference the name somewhere the scan can see it.
 *
 * Output: assets/fonts/subset/<Family>.ttf (native) and .woff2 (web). The
 * files are committed so native builds that don't run this step still work.
 */
import subsetFont from 'subset-font';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'assets', 'fonts', 'subset');

// Google Fonts' "latin" subset range.
const LATIN_RANGES: Array<[number, number]> = [
  [0x0000, 0x00ff], [0x0131, 0x0131], [0x0152, 0x0153], [0x02bb, 0x02bc], [0x02c6, 0x02c6],
  [0x02da, 0x02da], [0x02dc, 0x02dc], [0x2000, 0x206f], [0x2074, 0x2074], [0x20ac, 0x20ac],
  [0x2122, 0x2122], [0x2191, 0x2191], [0x2193, 0x2193], [0x2212, 0x2212], [0x2215, 0x2215],
  [0xfeff, 0xfeff], [0xfffd, 0xfffd],
];
const latinText = LATIN_RANGES.flatMap(([a, b]) =>
  Array.from({ length: b - a + 1 }, (_, i) => String.fromCodePoint(a + i)),
).join('');

const TEXT_FACES: Record<string, string> = {
  Manrope_400Regular: '@expo-google-fonts/manrope/400Regular/Manrope_400Regular.ttf',
  Manrope_600SemiBold: '@expo-google-fonts/manrope/600SemiBold/Manrope_600SemiBold.ttf',
  Manrope_700Bold: '@expo-google-fonts/manrope/700Bold/Manrope_700Bold.ttf',
  Newsreader_400Regular: '@expo-google-fonts/newsreader/400Regular/Newsreader_400Regular.ttf',
  Newsreader_400Regular_Italic:
    '@expo-google-fonts/newsreader/400Regular_Italic/Newsreader_400Regular_Italic.ttf',
  Newsreader_700Bold: '@expo-google-fonts/newsreader/700Bold/Newsreader_700Bold.ttf',
};
const ICON_FONT = '@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf';
const ICON_GLYPHS = '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json';

function* sourceFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* sourceFiles(p);
    else if (/\.(tsx?|jsx?|json)$/.test(name)) yield p;
  }
}

function usedIconNames(glyphs: Record<string, number>): string[] {
  const names = new Set(Object.keys(glyphs));
  const used = new Set<string>();
  for (const dir of ['app', 'components', 'constants', 'lib', 'hooks']) {
    const abs = join(root, dir);
    if (!existsSync(abs)) continue;
    for (const file of sourceFiles(abs)) {
      const src = readFileSync(file, 'utf8');
      for (const m of src.matchAll(/['"`]([a-z0-9][a-z0-9-]*)['"`]/g)) {
        if (names.has(m[1])) used.add(m[1]);
      }
    }
  }
  return [...used].sort();
}

async function emit(name: string, source: Buffer, text: string) {
  const ttf = await subsetFont(source, text, { targetFormat: 'truetype' });
  const woff2 = await subsetFont(source, text, { targetFormat: 'woff2' });
  // Re-wrapped as plain Uint8Array: two @types/node versions disagree about Buffer.
  writeFileSync(join(outDir, `${name}.ttf`), new Uint8Array(ttf.buffer, ttf.byteOffset, ttf.byteLength));
  writeFileSync(join(outDir, `${name}.woff2`), new Uint8Array(woff2.buffer, woff2.byteOffset, woff2.byteLength));
  const kb = (n: number) => `${Math.round(n / 1024)} KB`;
  console.log(
    `[subset-fonts] ${name.padEnd(30)} ${kb(source.byteLength).padStart(7)} → ttf ${kb(ttf.byteLength).padStart(6)}, woff2 ${kb(woff2.byteLength).padStart(6)}`,
  );
}

async function main() {
  for (const [name, mod] of Object.entries(TEXT_FACES)) {
    await emit(name, readFileSync(require.resolve(mod)), latinText);
  }
  const glyphs = require(ICON_GLYPHS) as Record<string, number>;
  const icons = usedIconNames(glyphs);
  const iconText = icons.map((n) => String.fromCodePoint(glyphs[n])).join('');
  await emit('MaterialIcons', readFileSync(require.resolve(ICON_FONT)), iconText);
  writeFileSync(join(outDir, 'MaterialIcons.glyphs.txt'), `${icons.join('\n')}\n`);
  console.log(`[subset-fonts] MaterialIcons keeps ${icons.length} of ${Object.keys(glyphs).length} glyphs.`);
}

main().catch((err) => {
  console.error('[subset-fonts] Failed:', err);
  process.exit(1);
});
