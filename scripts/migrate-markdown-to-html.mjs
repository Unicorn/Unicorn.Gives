/**
 * One-time migration: convert markdown body content to HTML.
 *
 * Reads all records with markdown-formatted body fields and converts them
 * to HTML using `marked`. The admin TipTap editor outputs HTML, so this
 * ensures consistency. The public MarkdownRenderer handles both formats.
 *
 * Usage:
 *   node scripts/migrate-markdown-to-html.mjs [--dry-run]
 *
 * Options:
 *   --dry-run   Preview changes without writing to the database
 *
 * Requires:
 *   - SUPABASE_URL and SUPABASE_ANON_KEY in .env or apps/mobile/.env
 *   - A valid super_admin account (clay@unicorn.love)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Load env vars ──
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const m = line.trim().match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadEnv(path.join(ROOT, '.env'));
loadEnv(path.join(ROOT, 'apps/mobile/.env'));

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');

// ── Configure marked ──
marked.setOptions({ gfm: true, breaks: true });

// ── Content detection ──
function isMarkdown(body) {
  if (!body || !body.trim()) return false;
  // If it has block-level HTML tags, it's already HTML
  if (/<(?:p|h[1-6]|ul|ol|li|blockquote|pre|div|table|hr)\b[^>]*>/i.test(body)) return false;
  // Check for markdown patterns
  return /\*\*|##|^---+$|^\- |^\d+\.\s|^\*\s|\[.+?\]\(.+?\)/m.test(body);
}

function convertMarkdown(body) {
  return marked.parse(body);
}

// ── Tables with body fields that may contain markdown ──
const TABLES = [
  { name: 'minutes', bodyField: 'body' },
  { name: 'pages', bodyField: 'body' },
  { name: 'guides', bodyField: 'body' },
  { name: 'partner_pages', bodyField: 'body' },
  { name: 'news', bodyField: 'body' },
  { name: 'region_pages', bodyField: 'body' },
  { name: 'ordinances', bodyField: 'body' },
  { name: 'events', bodyField: 'body' },
  { name: 'elections', bodyField: 'body' },
];

// ── Main ──
async function main() {
  console.log(`\n🔄 Markdown → HTML Migration${DRY_RUN ? ' (DRY RUN)' : ''}\n`);

  // Create Supabase client and sign in as super_admin
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'clay@unicorn.love',
    password: 'ClayHanna#2021',
  });
  if (authError) {
    console.error('Auth failed:', authError.message);
    process.exit(1);
  }
  console.log('✅ Authenticated as clay@unicorn.love\n');

  let totalConverted = 0;
  let totalSkipped = 0;

  for (const table of TABLES) {
    const { data: rows, error } = await supabase
      .from(table.name)
      .select(`id, slug, title, ${table.bodyField}`)
      .not(table.bodyField, 'is', null);

    if (error) {
      console.error(`  ❌ Error reading ${table.name}: ${error.message}`);
      continue;
    }

    const markdownRows = rows.filter((r) => isMarkdown(r[table.bodyField]));
    const htmlRows = rows.filter((r) => !isMarkdown(r[table.bodyField]) && r[table.bodyField]?.trim());

    console.log(`📋 ${table.name}: ${rows.length} total, ${markdownRows.length} markdown, ${htmlRows.length} already HTML/plain`);

    if (markdownRows.length === 0) {
      totalSkipped += rows.length;
      continue;
    }

    for (const row of markdownRows) {
      const original = row[table.bodyField];
      const html = convertMarkdown(original);

      if (DRY_RUN) {
        const title = row.title || row.slug || row.id;
        console.log(`  📝 Would convert: ${title.slice(0, 60)}`);
        console.log(`     Before (${original.length} chars): ${original.slice(0, 80).replace(/\n/g, '\\n')}...`);
        console.log(`     After  (${html.length} chars): ${html.slice(0, 80).replace(/\n/g, '\\n')}...`);
        totalConverted++;
        continue;
      }

      const { error: updateError } = await supabase
        .from(table.name)
        .update({ [table.bodyField]: html })
        .eq('id', row.id);

      if (updateError) {
        console.error(`  ❌ Failed to update ${row.id}: ${updateError.message}`);
      } else {
        totalConverted++;
      }
    }

    totalSkipped += htmlRows.length;
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`✅ Converted: ${totalConverted} records`);
  console.log(`⏭️  Skipped:   ${totalSkipped} records (already HTML or plain text)`);
  if (DRY_RUN) {
    console.log(`\n⚠️  This was a dry run. Re-run without --dry-run to apply changes.`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
