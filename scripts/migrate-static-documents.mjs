/**
 * One-time migration: upload static PDFs to Supabase Storage and update DB rows.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/migrate-static-documents.mjs
 *
 * Requires:
 *   - root .env with SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY env var (not stored in .env for safety)
 *   - supabase/.temp/pooler-url + SUPABASE_DB_PASSWORD in .env
 */
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const BUCKET = 'media';
const FOLDER = 'municipal-documents';

const DOCUMENTS = [
  {
    localFile: 'apps/mobile/public/documents/lincoln-township/master-plan-2040.pdf',
    storagePath: `${FOLDER}/master-plan-2040.pdf`,
    slug: 'master-plan-2040',
  },
  {
    localFile: 'apps/mobile/public/documents/lincoln-township/recreation-plan-2026-2030.pdf',
    storagePath: `${FOLDER}/recreation-plan-2026-2030.pdf`,
    slug: 'recreation-plan-2026-2030',
  },
  {
    localFile: 'apps/mobile/public/documents/lincoln-township/zoning-ordinance-44.pdf',
    storagePath: `${FOLDER}/zoning-ordinance-44.pdf`,
    slug: 'zoning-ordinance-44',
  },
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

async function uploadToStorage(supabaseUrl, serviceRoleKey, storagePath, fileBuffer) {
  const url = `${supabaseUrl}/storage/v1/object/${BUCKET}/${storagePath}`;

  // Check if file already exists — try to get metadata
  const headRes = await fetch(url, {
    method: 'HEAD',
    headers: { Authorization: `Bearer ${serviceRoleKey}`, apikey: serviceRoleKey },
  });

  if (headRes.ok) {
    console.log(`  Already exists: ${storagePath} — skipping upload`);
    return;
  }

  const res = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${storagePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      'Content-Type': 'application/pdf',
      'Cache-Control': 'max-age=3600',
      'x-upsert': 'true',
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Upload failed for ${storagePath}: ${res.status} ${body}`);
  }

  console.log(`  Uploaded: ${storagePath}`);
}

async function main() {
  const root = process.cwd();
  loadEnvFile(path.join(root, '.env'));
  loadEnvFile(path.join(root, '.env.local'));

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;

  if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');
  if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY — pass it as an env var');
  if (!dbPassword) throw new Error('Missing SUPABASE_DB_PASSWORD');

  const publicUrl = (storagePath) =>
    `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${storagePath}`;

  // 1. Upload each PDF to Supabase Storage
  console.log('Uploading PDFs to Supabase Storage...');
  for (const doc of DOCUMENTS) {
    const filePath = path.join(root, doc.localFile);
    if (!fs.existsSync(filePath)) {
      console.warn(`  SKIP: ${doc.localFile} not found`);
      continue;
    }
    const buffer = fs.readFileSync(filePath);
    await uploadToStorage(supabaseUrl, serviceRoleKey, doc.storagePath, buffer);
  }

  // 2. Update DB rows to point to Supabase Storage URLs
  console.log('\nUpdating database pdf_url values...');
  const poolerUrlPath = path.join(root, 'supabase', '.temp', 'pooler-url');
  const poolerUrl = fs.readFileSync(poolerUrlPath, 'utf8').trim();
  const u = new URL(poolerUrl);
  u.password = dbPassword;

  const { Client } = pg;
  const client = new Client({ connectionString: u.toString() });
  await client.connect();

  for (const doc of DOCUMENTS) {
    const newUrl = publicUrl(doc.storagePath);
    const result = await client.query(
      `UPDATE public.municipal_documents SET pdf_url = $1 WHERE slug = $2 RETURNING id, title`,
      [newUrl, doc.slug],
    );
    if (result.rowCount > 0) {
      console.log(`  Updated: ${result.rows[0].title} → ${newUrl}`);
    } else {
      console.warn(`  No row found for slug: ${doc.slug}`);
    }
  }

  await client.end();
  console.log('\nDone! PDFs are now served from Supabase Storage.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
