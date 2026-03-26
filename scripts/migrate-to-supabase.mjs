/**
 * Migrate markdown content from Astro collections to Supabase.
 *
 * Usage: node scripts/migrate-to-supabase.mjs
 *
 * Reads all markdown files from src/content/* and inserts them into the
 * corresponding Supabase tables. Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * env vars (service role key bypasses RLS for bulk insert).
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { config } from 'dotenv';

// Load env from root .env
config({ path: join(import.meta.dirname, '..', '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  console.error('The service role key is needed to bypass RLS for migration.');
  console.error('Find it in Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const CONTENT_DIR = join(import.meta.dirname, '..', 'src', 'content');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const frontmatter = {};
  let currentKey = null;
  let inArray = false;
  let arrayKey = null;
  let arrayItems = [];
  let inNestedObject = false;
  let nestedObj = {};
  let parentKey = null;
  let nestedArrayItems = [];

  const lines = match[1].split('\n');

  for (const line of lines) {
    // Skip empty lines
    if (line.trim() === '') continue;

    // Detect top-level key
    const topKeyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (topKeyMatch && !line.startsWith('  ') && !line.startsWith('\t')) {
      // Flush previous array/nested
      if (inArray && arrayKey) {
        frontmatter[arrayKey] = arrayItems;
        arrayItems = [];
        inArray = false;
      }
      if (inNestedObject && parentKey) {
        if (nestedArrayItems.length > 0) {
          frontmatter[parentKey] = nestedArrayItems;
        } else {
          frontmatter[parentKey] = nestedObj;
        }
        nestedObj = {};
        nestedArrayItems = [];
        inNestedObject = false;
      }

      const [, key, value] = topKeyMatch;
      currentKey = key;

      if (value === '') {
        // Could be an object or array — handled by subsequent lines
        inNestedObject = true;
        parentKey = key;
        nestedObj = {};
        nestedArrayItems = [];
      } else {
        frontmatter[key] = parseValue(value);
      }
      continue;
    }

    // Nested array item (starts with "  - ")
    if (line.match(/^\s+-\s/) && inNestedObject) {
      const itemLine = line.replace(/^\s+-\s*/, '');

      // Simple string array item
      if (!itemLine.includes(':')) {
        if (!Array.isArray(frontmatter[parentKey])) {
          frontmatter[parentKey] = [];
        }
        // Check if we already pushed partial objects
        if (nestedArrayItems.length > 0 && Object.keys(nestedObj).length > 0) {
          nestedArrayItems.push({ ...nestedObj });
          nestedObj = {};
        }
        frontmatter[parentKey] = frontmatter[parentKey] || [];
        frontmatter[parentKey].push(parseValue(itemLine));
        continue;
      }

      // Object array item — first key-value of new object
      if (Object.keys(nestedObj).length > 0) {
        nestedArrayItems.push({ ...nestedObj });
        nestedObj = {};
      }
      const [k, ...rest] = itemLine.split(':');
      nestedObj[k.trim()] = parseValue(rest.join(':').trim());
      continue;
    }

    // Continuation of nested object (starts with spaces, has key: value)
    if (line.match(/^\s+\w+:/) && (inNestedObject || inArray)) {
      const kvMatch = line.trim().match(/^(\w+):\s*(.*)$/);
      if (kvMatch) {
        nestedObj[kvMatch[1]] = parseValue(kvMatch[2]);
      }
      continue;
    }

    // Simple array items
    if (line.match(/^\s*-\s/) && currentKey) {
      if (!inArray) {
        inArray = true;
        arrayKey = currentKey;
        arrayItems = [];
      }
      arrayItems.push(parseValue(line.replace(/^\s*-\s*/, '')));
      continue;
    }
  }

  // Flush final state
  if (inArray && arrayKey) {
    frontmatter[arrayKey] = arrayItems;
  }
  if (inNestedObject && parentKey) {
    if (nestedArrayItems.length > 0) {
      if (Object.keys(nestedObj).length > 0) {
        nestedArrayItems.push({ ...nestedObj });
      }
      frontmatter[parentKey] = nestedArrayItems;
    } else if (Object.keys(nestedObj).length > 0) {
      frontmatter[parentKey] = nestedObj;
    }
  }

  return { data: frontmatter, body: match[2].trim() };
}

function parseValue(val) {
  if (typeof val !== 'string') return val;
  val = val.trim();
  // Remove quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  // Booleans
  if (val === 'true') return true;
  if (val === 'false') return false;
  // Numbers
  if (/^\d+$/.test(val)) return parseInt(val, 10);
  if (/^\d+\.\d+$/.test(val)) return parseFloat(val);
  return val;
}

function readCollection(name) {
  const dir = join(CONTENT_DIR, name);
  let files;
  try {
    files = readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  } catch {
    console.warn(`  Collection "${name}" directory not found, skipping.`);
    return [];
  }

  return files.map(file => {
    const content = readFileSync(join(dir, file), 'utf-8');
    const { data, body } = parseFrontmatter(content);
    const slug = basename(file, '.md').replace('.mdx', '');
    return { slug, ...data, body };
  });
}

// ---------------------------------------------------------------------------
// Migration functions
// ---------------------------------------------------------------------------

async function getRegionId(slug) {
  const { data } = await supabase.from('regions').select('id').eq('slug', slug).single();
  return data?.id;
}

async function getPartnerId(slug) {
  const { data } = await supabase.from('partners').select('id').eq('slug', slug).single();
  return data?.id;
}

async function migrateContacts(regionId) {
  const items = readCollection('contacts');
  console.log(`\nMigrating ${items.length} contacts...`);

  const rows = items.map(item => ({
    region_id: regionId,
    slug: item.slug,
    name: item.name,
    role: item.role,
    department: item.department,
    phone: item.phone || null,
    phone_ext: item.phoneExt || null,
    email: item.email || null,
    address: item.address || null,
    hours: item.hours || null,
    website: item.website || null,
    display_order: item.order || 0,
    status: 'published',
  }));

  const { data, error } = await supabase.from('contacts').upsert(rows, { onConflict: 'region_id,slug' });
  if (error) console.error('  Contacts error:', error.message);
  else console.log(`  ✓ ${rows.length} contacts migrated`);
}

async function migrateMinutes(regionId) {
  const items = readCollection('minutes');
  console.log(`\nMigrating ${items.length} minutes...`);

  const rows = items.map(item => ({
    region_id: regionId,
    slug: item.slug,
    title: item.title,
    date: item.date,
    meeting_type: item.meetingType || 'Board Meeting',
    status: item.status || 'approved',
    source: item.source || 'transcribed',
    body: item.body || '',
    pdf_url: item.pdfUrl || null,
    attendees_present: item.attendees?.present || [],
    attendees_absent: item.attendees?.absent || [],
    attendees_also_present: item.attendees?.alsoPresent || [],
    published_at: 'now()',
  }));

  // Insert in batches of 50 to avoid payload limits
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error } = await supabase.from('minutes').upsert(batch, { onConflict: 'region_id,slug' });
    if (error) console.error(`  Minutes batch ${i} error:`, error.message);
  }
  console.log(`  ✓ ${rows.length} minutes migrated`);
}

async function migrateOrdinances(regionId) {
  const items = readCollection('ordinances');
  console.log(`\nMigrating ${items.length} ordinances...`);

  const rows = items.map(item => ({
    region_id: regionId,
    slug: item.slug,
    title: item.title,
    number: item.number || null,
    description: item.description || null,
    body: item.body || '',
    category: item.category,
    adopted_date: item.adoptedDate || null,
    amended_date: item.amendedDate || null,
    pdf_url: item.pdfUrl || null,
    status: 'published',
    published_at: 'now()',
  }));

  const { error } = await supabase.from('ordinances').upsert(rows, { onConflict: 'region_id,slug' });
  if (error) console.error('  Ordinances error:', error.message);
  else console.log(`  ✓ ${rows.length} ordinances migrated`);
}

async function migrateNews() {
  const items = readCollection('news');
  console.log(`\nMigrating ${items.length} news articles...`);

  // Map old categories to new ones
  const categoryMap = {
    'township': 'government-action',
    'unicorn-gives': 'community',
    'the-horn': 'community',
    'the-mane': 'community',
    'community': 'community',
    'ordinance-change': 'ordinance-change',
    'government-action': 'government-action',
    'public-safety': 'public-safety',
    'public-notice': 'public-notice',
    'infrastructure': 'infrastructure',
    'election': 'election',
  };

  const rows = items.map(item => ({
    slug: item.slug,
    title: item.title,
    description: item.description || null,
    body: item.body || '',
    date: item.date,
    author_name: item.author || null,
    category: categoryMap[item.category] || 'community',
    source: item.source || null,
    source_url: item.sourceUrl || null,
    featured: item.featured || false,
    impact: item.impact || null,
    image_url: item.image || null,
    visibility: 'global',
    status: 'published',
    published_at: 'now()',
  }));

  const { error } = await supabase.from('news').upsert(rows, { onConflict: 'slug' });
  if (error) console.error('  News error:', error.message);
  else console.log(`  ✓ ${rows.length} news articles migrated`);
}

async function migrateEvents() {
  const items = readCollection('events');
  console.log(`\nMigrating ${items.length} events...`);

  const rows = items.map(item => ({
    slug: item.slug,
    title: item.title,
    description: item.description || null,
    body: item.body || '',
    date: item.date,
    end_date: item.endDate || null,
    time: item.time || null,
    location: item.location || null,
    category: item.category,
    recurring: item.recurring || false,
    recurrence_rule: item.recurrenceRule || null,
    registration_url: item.registrationUrl || null,
    cost: item.cost || null,
    visibility: 'global',
    status: 'published',
    published_at: 'now()',
  }));

  const { error } = await supabase.from('events').upsert(rows, { onConflict: 'slug' });
  if (error) console.error('  Events error:', error.message);
  else console.log(`  ✓ ${rows.length} events migrated`);
}

async function migrateGuides() {
  const items = readCollection('guides');
  console.log(`\nMigrating ${items.length} guides...`);

  for (const item of items) {
    // Insert guide
    const { data: guide, error } = await supabase.from('guides').upsert({
      slug: item.slug,
      title: item.title,
      description: item.description || null,
      body: item.body || '',
      category: item.category,
      scenario: item.scenario,
      icon: item.icon || null,
      jurisdiction: item.jurisdiction || null,
      last_verified: item.lastVerified || null,
      status: 'published',
      published_at: 'now()',
    }, { onConflict: 'slug' }).select('id').single();

    if (error) {
      console.error(`  Guide "${item.slug}" error:`, error.message);
      continue;
    }

    // Insert guide contacts
    if (item.contacts && Array.isArray(item.contacts)) {
      // Delete existing contacts for this guide first
      await supabase.from('guide_contacts').delete().eq('guide_id', guide.id);

      const contacts = item.contacts.map((c, i) => ({
        guide_id: guide.id,
        name: c.name,
        role: c.role || null,
        phone: c.phone || null,
        email: c.email || null,
        display_order: i,
      }));
      const { error: cErr } = await supabase.from('guide_contacts').insert(contacts);
      if (cErr) console.error(`  Guide contacts for "${item.slug}" error:`, cErr.message);
    }

    // Insert guide forms
    if (item.forms && Array.isArray(item.forms)) {
      await supabase.from('guide_forms').delete().eq('guide_id', guide.id);

      const forms = item.forms.map((f, i) => ({
        guide_id: guide.id,
        name: f.name,
        url: f.url,
        format: f.format || 'PDF',
        display_order: i,
      }));
      const { error: fErr } = await supabase.from('guide_forms').insert(forms);
      if (fErr) console.error(`  Guide forms for "${item.slug}" error:`, fErr.message);
    }
  }
  console.log(`  ✓ ${items.length} guides migrated`);
}

async function migratePages(hornPartnerId, manePartnerId) {
  const items = readCollection('pages');
  console.log(`\nMigrating ${items.length} pages...`);

  // Categorize pages by destination
  const hornPages = [];
  const manePages = [];
  const globalPages = [];

  for (const item of items) {
    const sub = (item.subcategory || '').toLowerCase();

    if (sub === 'the horn' || sub.includes('horn')) {
      hornPages.push(item);
    } else if (sub === 'the mane' || sub.includes('mane')) {
      manePages.push(item);
    } else {
      globalPages.push(item);
    }
  }

  // Migrate global pages
  if (globalPages.length > 0) {
    const rows = globalPages.map(item => ({
      slug: item.slug,
      title: item.title,
      description: item.description || null,
      body: item.body || '',
      category: item.category || null,
      subcategory: item.subcategory || null,
      nav_title: item.navTitle || null,
      hide_from_nav: item.hideFromNav || false,
      display_order: item.order || 0,
      status: 'published',
      published_at: 'now()',
    }));

    const { error } = await supabase.from('pages').upsert(rows, { onConflict: 'slug' });
    if (error) console.error('  Pages error:', error.message);
    else console.log(`  ✓ ${rows.length} global pages migrated`);
  }

  // Migrate Horn partner pages
  if (hornPages.length > 0 && hornPartnerId) {
    const rows = hornPages.map(item => ({
      partner_id: hornPartnerId,
      slug: item.slug,
      title: item.title,
      body: item.body || '',
      tab_slug: inferTabSlug(item.slug, 'horn'),
      display_order: item.order || 0,
      status: 'published',
      published_at: 'now()',
    }));

    const { error } = await supabase.from('partner_pages').upsert(rows, { onConflict: 'partner_id,slug' });
    if (error) console.error('  Horn pages error:', error.message);
    else console.log(`  ✓ ${rows.length} Horn partner pages migrated`);
  }

  // Migrate Mane partner pages
  if (manePages.length > 0 && manePartnerId) {
    const rows = manePages.map(item => ({
      partner_id: manePartnerId,
      slug: item.slug,
      title: item.title,
      body: item.body || '',
      tab_slug: inferTabSlug(item.slug, 'mane'),
      display_order: item.order || 0,
      status: 'published',
      published_at: 'now()',
    }));

    const { error } = await supabase.from('partner_pages').upsert(rows, { onConflict: 'partner_id,slug' });
    if (error) console.error('  Mane pages error:', error.message);
    else console.log(`  ✓ ${rows.length} Mane partner pages migrated`);
  }
}

function inferTabSlug(slug, partner) {
  // Map page slugs to tab slugs based on content
  if (slug.includes('about') || slug === `about-the-${partner}`) return 'about';
  if (slug.includes('hours') || slug.includes('contact')) return partner === 'horn' ? 'hours-horn' : 'hours';
  if (slug.includes('event')) return 'events';
  if (slug.includes('member') || slug.includes('join')) return 'membership';
  if (slug.includes('service')) return 'services';
  if (slug.includes('book') || slug.includes('appointment')) return 'book';
  return slug; // fallback: use the slug as-is
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Unicorn.Gives Content Migration ===\n');

  // Get region and partner IDs
  const lincolnId = await getRegionId('lincoln-township');
  const hornId = await getPartnerId('the-horn');
  const maneId = await getPartnerId('the-mane');

  if (!lincolnId) {
    console.error('Lincoln Township region not found! Run the schema migration first.');
    process.exit(1);
  }

  console.log('Region IDs:', { lincolnTownship: lincolnId });
  console.log('Partner IDs:', { theHorn: hornId, theMane: maneId });

  // Run migrations in dependency order
  await migrateContacts(lincolnId);
  await migrateOrdinances(lincolnId);
  await migrateMinutes(lincolnId);
  await migrateGuides();
  await migrateNews();
  await migrateEvents();
  await migratePages(hornId, maneId);

  // Verify counts
  console.log('\n=== Verification ===\n');
  const tables = ['contacts', 'ordinances', 'minutes', 'guides', 'guide_contacts', 'guide_forms', 'news', 'events', 'pages', 'partner_pages'];
  for (const table of tables) {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    console.log(`  ${table}: ${count} rows`);
  }

  console.log('\n=== Migration Complete ===');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
