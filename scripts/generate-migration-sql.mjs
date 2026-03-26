/**
 * Generates a SQL migration file from markdown content.
 * Output: supabase/migrations/002_seed_content.sql
 *
 * Usage: node scripts/generate-migration-sql.mjs
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

// Repo-root content directory (where all markdown sources live)
const CONTENT_DIR = join(import.meta.dirname, '..', 'content');
const OUTPUT = join(import.meta.dirname, '..', 'supabase', 'migrations', '002_seed_content.sql');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const yaml = match[1];
  const body = match[2].trim();
  const data = {};

  // Simple YAML parser for our known frontmatter shapes
  let inNested = false;
  let nestedKey = null;
  let nestedObj = {};
  let nestedArray = [];
  let isArray = false;

  for (const line of yaml.split('\n')) {
    if (line.trim() === '') continue;

    // Top-level key: value
    const topMatch = line.match(/^([a-zA-Z]\w*):\s*(.*)$/);
    if (topMatch && !line.startsWith(' ') && !line.startsWith('\t')) {
      // Flush previous nested
      if (inNested && nestedKey) {
        if (isArray) {
          if (Object.keys(nestedObj).length > 0) nestedArray.push({ ...nestedObj });
          data[nestedKey] = nestedArray;
        } else {
          data[nestedKey] = Object.keys(nestedObj).length > 0 ? nestedObj : nestedArray;
        }
      }
      inNested = false;
      nestedObj = {};
      nestedArray = [];
      isArray = false;

      const [, key, val] = topMatch;

      if (val === '' || val === undefined) {
        inNested = true;
        nestedKey = key;
        nestedObj = {};
        nestedArray = [];
      } else {
        data[key] = parseVal(val);
      }
      continue;
    }

    // Nested array item: "  - something" or "    - key: value"
    if (line.match(/^\s+-\s/) && inNested) {
      isArray = true;
      const stripped = line.replace(/^\s+-\s*/, '');

      if (stripped.includes(':')) {
        // First KV of new object in array
        if (Object.keys(nestedObj).length > 0) {
          nestedArray.push({ ...nestedObj });
          nestedObj = {};
        }
        const [k, ...rest] = stripped.split(':');
        nestedObj[k.trim()] = parseVal(rest.join(':').trim());
      } else {
        // Simple string item
        nestedArray.push(parseVal(stripped));
      }
      continue;
    }

    // Nested KV: "    key: value"
    if (line.match(/^\s+\w+:/) && inNested) {
      const kvMatch = line.trim().match(/^(\w+):\s*(.*)$/);
      if (kvMatch) {
        nestedObj[kvMatch[1]] = parseVal(kvMatch[2]);
      }
      continue;
    }
  }

  // Flush final
  if (inNested && nestedKey) {
    if (isArray) {
      if (Object.keys(nestedObj).length > 0) nestedArray.push({ ...nestedObj });
      data[nestedKey] = nestedArray;
    } else {
      data[nestedKey] = Object.keys(nestedObj).length > 0 ? nestedObj : nestedArray;
    }
  }

  return { data, body };
}

function parseVal(val) {
  if (typeof val !== 'string') return val;
  val = val.trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
    val = val.slice(1, -1);
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (/^\d+$/.test(val)) return parseInt(val, 10);
  if (/^\d+\.\d+$/.test(val)) return parseFloat(val);
  return val;
}

function parseDateIsoOrNow(value) {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function escArr(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'";
  return "ARRAY[" + arr.map(s => esc(s)).join(', ') + "]";
}

function readCollection(name) {
  const dir = join(CONTENT_DIR, name);
  let files;
  try {
    files = readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  } catch {
    console.warn(`  Collection "${name}" not found, skipping.`);
    return [];
  }
  return files.map(file => {
    const content = readFileSync(join(dir, file), 'utf-8');
    const { data, body } = parseFrontmatter(content);
    const slug = basename(file).replace(/\.mdx?$/, '');
    return { slug, ...data, body };
  });
}

// ---------------------------------------------------------------------------
// SQL generators
// ---------------------------------------------------------------------------

function genContacts(items) {
  const lines = items.map(item => {
    const regionVar = item.jurisdiction === 'county' ? 'clare_county_id' : 'lincoln_id';
    return `(${regionVar}, ${esc(item.slug)}, ${esc(item.name)}, ${esc(item.role)}, ${esc(item.department)}, ${esc(item.phone || null)}, ${esc(item.phoneExt || null)}, ${esc(item.email || null)}, ${esc(item.address || null)}, ${esc(item.hours || null)}, ${esc(item.website || null)}, ${item.order || 0}, 'published', now(), now())`;
  });
  return `INSERT INTO public.contacts (region_id, slug, name, role, department, phone, phone_ext, email, address, hours, website, display_order, status, created_at, updated_at)
VALUES
${lines.join(',\n')}
ON CONFLICT (region_id, slug) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, department = EXCLUDED.department, phone = EXCLUDED.phone;`;
}

function genMinutes(items) {
  const lines = items.map(item => {
    const present = item.attendees?.present || [];
    const absent = item.attendees?.absent || [];
    const also = item.attendees?.alsoPresent || [];
    return `(lincoln_id, ${esc(item.slug)}, ${esc(item.title)}, ${esc(item.date)}, ${esc(item.meetingType || 'Board Meeting')}, ${esc(item.status || 'approved')}, ${esc(item.source || 'transcribed')}, ${esc(item.body)}, ${esc(item.pdfUrl || null)}, ${escArr(present)}, ${escArr(absent)}, ${escArr(also)}, now(), now())`;
  });
  return `INSERT INTO public.minutes (region_id, slug, title, date, meeting_type, status, source, body, pdf_url, attendees_present, attendees_absent, attendees_also_present, created_at, published_at)
VALUES
${lines.join(',\n')}
ON CONFLICT (region_id, slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, status = EXCLUDED.status;`;
}

function genOrdinances(items) {
  const lines = items.map(item =>
    `(lincoln_id, ${esc(item.slug)}, ${esc(item.title)}, ${item.number || 'NULL'}, ${esc(item.description || null)}, ${esc(item.body)}, ${esc(item.category)}, ${item.adoptedDate ? esc(item.adoptedDate) : 'NULL'}, ${item.amendedDate ? esc(item.amendedDate) : 'NULL'}, ${esc(item.pdfUrl || null)}, 'published', now(), now())`
  );
  return `INSERT INTO public.ordinances (region_id, slug, title, number, description, body, category, adopted_date, amended_date, pdf_url, status, created_at, published_at)
VALUES
${lines.join(',\n')}
ON CONFLICT (region_id, slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;`;
}

function genNews(items) {
  const categoryMap = {
    'township': 'government-action', 'unicorn-gives': 'community', 'the-horn': 'community',
    'the-mane': 'community', 'community': 'community', 'ordinance-change': 'ordinance-change',
    'government-action': 'government-action', 'public-safety': 'public-safety',
    'public-notice': 'public-notice', 'infrastructure': 'infrastructure', 'election': 'election',
  };
  const lines = items.map(item =>
    `(${esc(item.slug)}, ${esc(item.title)}, ${esc(item.description || null)}, ${esc(item.body)}, ${esc(item.date)}, ${esc(item.author || null)}, ${esc(categoryMap[item.category] || 'community')}, ${esc(item.source || null)}, ${esc(item.sourceUrl || null)}, ${item.featured ? 'true' : 'false'}, ${esc(item.impact || null)}, ${esc(item.image || null)}, 'global', 'published', now(), now())`
  );
  return `INSERT INTO public.news (slug, title, description, body, date, author_name, category, source, source_url, featured, impact, image_url, visibility, status, created_at, published_at)
VALUES
${lines.join(',\n')}
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;`;
}

function eventRegionVar(regionSlug) {
  const map = {
    'lincoln-township': 'lincoln_id',
    'clare-county': 'clare_county_id',
    'city-of-clare': 'clare_city_id',
    'city-of-harrison': 'harrison_city_id',
    'village-of-farwell': 'farwell_village_id',
  };
  return map[regionSlug] || 'NULL';
}

function genEvents(items) {
  const lines = items.map(item => {
    const regionRef = item.region ? eventRegionVar(item.region) : 'NULL';
    const tags = item.tags && Array.isArray(item.tags) && item.tags.length > 0 ? escArr(item.tags) : "'{}'";
    return `(${esc(item.slug)}, ${esc(item.title)}, ${esc(item.description || null)}, ${esc(item.body)}, ${esc(item.date)}, ${item.endDate ? esc(item.endDate) : 'NULL'}, ${esc(item.time || null)}, ${esc(item.location || null)}, ${esc(item.category)}, ${regionRef}, ${item.recurring ? 'true' : 'false'}, ${esc(item.recurrenceRule || null)}, ${esc(item.registrationUrl || null)}, ${esc(item.cost || null)}, ${tags}, 'global', 'published', now(), now())`;
  });
  return `INSERT INTO public.events (slug, title, description, body, date, end_date, time, location, category, region_id, recurring, recurrence_rule, registration_url, cost, tags, visibility, status, created_at, published_at)
VALUES
${lines.join(',\n')}
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, tags = EXCLUDED.tags, region_id = EXCLUDED.region_id;`;
}

function genGuides(items) {
  const guideInserts = items.map(item =>
    `(${esc(item.slug)}, ${esc(item.title)}, ${esc(item.description || null)}, ${esc(item.body)}, ${esc(item.category)}, ${esc(item.scenario)}, ${esc(item.icon || null)}, ${esc(item.jurisdiction || null)}, ${item.lastVerified ? esc(item.lastVerified) : 'NULL'}, 'published', now(), now())`
  );

  let sql = `INSERT INTO public.guides (slug, title, description, body, category, scenario, icon, jurisdiction, last_verified, status, created_at, published_at)
VALUES
${guideInserts.join(',\n')}
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, scenario = EXCLUDED.scenario;\n\n`;

  // Guide contacts and forms
  for (const item of items) {
    if (item.contacts && Array.isArray(item.contacts) && item.contacts.length > 0) {
      const contactLines = item.contacts.map((c, i) =>
        `((SELECT id FROM public.guides WHERE slug = ${esc(item.slug)}), ${esc(c.name)}, ${esc(c.role || null)}, ${esc(c.phone || null)}, ${esc(c.email || null)}, ${i})`
      );
      sql += `\n-- Guide contacts for: ${item.slug}
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = ${esc(item.slug)});
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
${contactLines.join(',\n')};\n`;
    }

    if (item.forms && Array.isArray(item.forms) && item.forms.length > 0) {
      const formLines = item.forms.map((f, i) =>
        `((SELECT id FROM public.guides WHERE slug = ${esc(item.slug)}), ${esc(f.name)}, ${esc(f.url)}, ${esc(f.format || 'PDF')}, ${i})`
      );
      sql += `\n-- Guide forms for: ${item.slug}
DELETE FROM public.guide_forms WHERE guide_id = (SELECT id FROM public.guides WHERE slug = ${esc(item.slug)});
INSERT INTO public.guide_forms (guide_id, name, url, format, display_order)
VALUES
${formLines.join(',\n')};\n`;
    }
  }

  return sql;
}

function genPages(items) {
  // Horn/Mane pages also need to exist in `public.pages` (global CMS),
  // because the mobile CMS route `[slug].tsx` queries `public.pages`.
  const hornPages = [];
  const manePages = [];
  const allPages = [];

  for (const item of items) {
    const sub = (item.subcategory || '').toLowerCase();
    if (sub === 'the horn' || sub.includes('horn')) hornPages.push(item);
    else if (sub === 'the mane' || sub.includes('mane')) manePages.push(item);
    allPages.push(item);
  }

  let sql = '';

  if (allPages.length > 0) {
    const lines = allPages.map((item) => {
      const description =
        item.description !== undefined ? (item.description ?? null) : null;

      return `(${esc(item.slug)}, ${esc(item.title)}, ${esc(description)}, ${esc(item.body)}, ${esc(
        item.category ?? null,
      )}, ${esc(item.subcategory ?? null)}, ${esc(item.navTitle ?? null)}, ${
        item.hideFromNav ? 'true' : 'false'
      }, ${item.order || 0}, 'published', ${esc(parseDateIsoOrNow(item.lastUpdated))}::timestamptz, now(), now())`;
    });

    sql += `INSERT INTO public.pages (slug, title, description, body, category, subcategory, nav_title, hide_from_nav, display_order, status, last_updated, created_at, published_at)
VALUES
${lines.join(',\n')}
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  body = EXCLUDED.body,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  nav_title = EXCLUDED.nav_title,
  hide_from_nav = EXCLUDED.hide_from_nav,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  last_updated = EXCLUDED.last_updated,
  published_at = EXCLUDED.published_at;\n\n`;
  }

  function inferTab(slug, partner) {
    if (slug.includes('about') || slug === `about-the-${partner}`) return 'about';
    // Normalize Horn club hours to the shared `hours` tab slug.
    if (slug.includes('hours') || slug.includes('contact')) return 'hours';
    if (slug.includes('event')) return 'events';
    if (slug.includes('member') || slug.includes('join')) return 'membership';
    if (slug.includes('service')) return 'services';
    if (slug.includes('book') || slug.includes('appointment')) return 'book';
    return slug;
  }

  if (hornPages.length > 0) {
    const lines = hornPages.map(item =>
      `(horn_id, ${esc(item.slug)}, ${esc(item.title)}, ${esc(item.body)}, ${esc(inferTab(item.slug, 'horn'))}, ${item.order || 0}, 'published', now(), now())`
    );
    sql += `INSERT INTO public.partner_pages (partner_id, slug, title, body, tab_slug, display_order, status, created_at, published_at)
VALUES
${lines.join(',\n')}
ON CONFLICT (partner_id, slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;\n\n`;
  }

  if (manePages.length > 0) {
    const lines = manePages.map(item =>
      `(mane_id, ${esc(item.slug)}, ${esc(item.title)}, ${esc(item.body)}, ${esc(inferTab(item.slug, 'mane'))}, ${item.order || 0}, 'published', now(), now())`
    );
    sql += `INSERT INTO public.partner_pages (partner_id, slug, title, body, tab_slug, display_order, status, created_at, published_at)
VALUES
${lines.join(',\n')}
ON CONFLICT (partner_id, slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;\n\n`;
  }

  return sql;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const contacts = readCollection('contacts');
const minutes = readCollection('minutes');
const ordinances = readCollection('ordinances');
const news = readCollection('news');
const events = readCollection('events');
const guides = readCollection('guides');
const pages = readCollection('pages');

console.log(`Content counts:
  contacts: ${contacts.length}
  minutes: ${minutes.length}
  ordinances: ${ordinances.length}
  news: ${news.length}
  events: ${events.length}
  guides: ${guides.length}
  pages: ${pages.length}
`);

const sql = `-- =============================================================================
-- Unicorn.Gives Content Seed Migration (auto-generated)
-- Generated: ${new Date().toISOString()}
-- =============================================================================

DO $$
DECLARE
  lincoln_id UUID;
  clare_county_id UUID;
  clare_city_id UUID;
  harrison_city_id UUID;
  farwell_village_id UUID;
  horn_id UUID;
  mane_id UUID;
BEGIN
  SELECT id INTO lincoln_id FROM public.regions WHERE slug = 'lincoln-township';
  SELECT id INTO clare_county_id FROM public.regions WHERE slug = 'clare-county';
  SELECT id INTO clare_city_id FROM public.regions WHERE slug = 'city-of-clare';
  SELECT id INTO harrison_city_id FROM public.regions WHERE slug = 'city-of-harrison';
  SELECT id INTO farwell_village_id FROM public.regions WHERE slug = 'village-of-farwell';
  SELECT id INTO horn_id FROM public.partners WHERE slug = 'the-horn';
  SELECT id INTO mane_id FROM public.partners WHERE slug = 'the-mane';

  IF lincoln_id IS NULL THEN
    RAISE EXCEPTION 'Lincoln Township region not found!';
  END IF;
  IF clare_county_id IS NULL THEN
    RAISE EXCEPTION 'Clare County region not found!';
  END IF;

-- =============================================================================
-- Contacts (${contacts.length})
-- =============================================================================

${genContacts(contacts)}

-- =============================================================================
-- Minutes (${minutes.length})
-- =============================================================================

${genMinutes(minutes)}

-- =============================================================================
-- Ordinances (${ordinances.length})
-- =============================================================================

${genOrdinances(ordinances)}

-- =============================================================================
-- News (${news.length})
-- =============================================================================

${genNews(news)}

-- =============================================================================
-- Events (${events.length})
-- =============================================================================

${genEvents(events)}

-- =============================================================================
-- Guides (${guides.length})
-- =============================================================================

${genGuides(guides)}

-- =============================================================================
-- Pages (${pages.length})
-- =============================================================================

${genPages(pages)}

END $$;
`;

writeFileSync(OUTPUT, sql);
console.log(`\nWritten to: ${OUTPUT}`);
console.log(`Size: ${(sql.length / 1024).toFixed(1)} KB`);
