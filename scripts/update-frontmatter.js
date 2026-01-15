#!/usr/bin/env node
/**
 * Script to batch update frontmatter of all page files
 * Adds category and subcategory fields based on navigation structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of page slugs to their category and subcategory
const pageMapping = {
  // Government - Board & Leadership
  'board': { category: 'Government', subcategory: 'Board & Leadership' },
  'board-minutes': { category: 'Government', subcategory: 'Board & Leadership' },
  'minutes-archive': { category: 'Government', subcategory: 'Board & Leadership' },

  // Government - Meetings & Calendar
  'calendar': { category: 'Government', subcategory: 'Meetings & Calendar' },

  // Services - Building & Development
  'building': { category: 'Services', subcategory: 'Building & Development' },
  'permits-forms': { category: 'Services', subcategory: 'Building & Development' },

  // Services - Public Safety
  'fire': { category: 'Services', subcategory: 'Public Safety' },

  // Services - Other Services
  'assessor': { category: 'Services', subcategory: 'Other Services' },
  'elections': { category: 'Services', subcategory: 'Other Services' },
  'compost': { category: 'Services', subcategory: 'Other Services' },

  // Planning & Zoning - Commissions
  'planning-commission': { category: 'Planning & Zoning', subcategory: 'Commissions' },
  'zba': { category: 'Planning & Zoning', subcategory: 'Commissions' },
  'zba-plancomm-minutes': { category: 'Planning & Zoning', subcategory: 'Commissions' },

  // Planning & Zoning - Regulations
  'zoning': { category: 'Planning & Zoning', subcategory: 'Regulations' },
  'ordinances': { category: 'Planning & Zoning', subcategory: 'Regulations' },
  'ordinances-zoning-ord-creation': { category: 'Planning & Zoning', subcategory: 'Regulations' },

  // Community - Resources
  'seniors': { category: 'Community', subcategory: 'Resources' },
  'newsletters': { category: 'Community', subcategory: 'Resources' },

  // Community - Facilities
  'cemeteries': { category: 'Community', subcategory: 'Facilities' },
  'parks': { category: 'Community', subcategory: 'Facilities' },

  // Natural Resources - Lakes
  'lakes': { category: 'Natural Resources', subcategory: 'Lakes' },
  'lakes-lakegeorge': { category: 'Natural Resources', subcategory: 'Lakes' },
  'lakes-shingle': { category: 'Natural Resources', subcategory: 'Lakes' },
  'lakes-bertha': { category: 'Natural Resources', subcategory: 'Lakes' },
  'lakes-silver': { category: 'Natural Resources', subcategory: 'Lakes' },

  // Information - Resources
  'faq': { category: 'Information', subcategory: 'Resources' },
  'foia': { category: 'Information', subcategory: 'Resources' },
  'links': { category: 'Information', subcategory: 'Resources' },
  'subscribe': { category: 'Information', subcategory: 'Resources' },
  'plat-maps': { category: 'Information', subcategory: 'Resources' }
};

const pagesDir = path.join(__dirname, '..', 'src', 'content', 'pages');

/**
 * Update frontmatter of a single file
 */
function updateFrontmatter(filePath, slug) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const mapping = pageMapping[slug];

  if (!mapping) {
    console.log(`⚠️  No mapping found for ${slug}, skipping...`);
    return;
  }

  // Check if already has category field
  if (content.includes('category:')) {
    console.log(`✓ ${slug} already has category field, skipping...`);
    return;
  }

  // Find the end of the frontmatter (after lastUpdated line)
  const lines = content.split('\n');
  let insertIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('lastUpdated:')) {
      insertIndex = i + 1;
      break;
    }
  }

  if (insertIndex === -1) {
    console.log(`❌ Could not find lastUpdated field in ${slug}, skipping...`);
    return;
  }

  // Insert category and subcategory fields
  const newFields = [
    `category: "${mapping.category}"`,
    `subcategory: "${mapping.subcategory}"`
  ];

  lines.splice(insertIndex, 0, ...newFields);

  const updatedContent = lines.join('\n');
  fs.writeFileSync(filePath, updatedContent, 'utf-8');

  console.log(`✅ Updated ${slug}.md with category: ${mapping.category}, subcategory: ${mapping.subcategory}`);
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting frontmatter update...\n');

  const files = fs.readdirSync(pagesDir);
  let updatedCount = 0;

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const slug = file.replace('.md', '');

    // Skip index.md (homepage)
    if (slug === 'index') {
      console.log(`⏭️  Skipping ${slug} (homepage)`);
      continue;
    }

    const filePath = path.join(pagesDir, file);
    updateFrontmatter(filePath, slug);
    updatedCount++;
  }

  console.log(`\n✨ Done! Updated ${updatedCount} page(s).`);
}

main();
