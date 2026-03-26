/**
 * Applies a SQL file to Supabase Postgres using the pooler connection string.
 *
 * Usage:
 *   node scripts/apply-supabase-sql.mjs supabase/migrations/002_seed_content.sql
 *
 * Requires:
 *   - root .env has SUPABASE_DB_PASSWORD
 *   - supabase/.temp/pooler-url exists
 */
import fs from 'fs';
import path from 'path';
import pg from 'pg';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const contents = fs.readFileSync(filePath, 'utf8');

  for (const rawLine of contents.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (!m) continue;

    const key = m[1];
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }

    if (!process.env[key]) process.env[key] = v;
  }
}

async function main() {
  loadEnvFile(path.join(process.cwd(), '.env'));
  loadEnvFile(path.join(process.cwd(), '.env.local'));

  const sqlFileArg = process.argv[2];
  if (!sqlFileArg) {
    throw new Error('Missing SQL file argument');
  }
  const sqlFilePath = path.isAbsolute(sqlFileArg)
    ? sqlFileArg
    : path.join(process.cwd(), sqlFileArg);

  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  const poolerUrlPath = path.join(process.cwd(), 'supabase', '.temp', 'pooler-url');
  const poolerUrl = fs.readFileSync(poolerUrlPath, 'utf8').trim();

  const password = process.env.SUPABASE_DB_PASSWORD ?? '';
  if (!password) throw new Error('Missing SUPABASE_DB_PASSWORD in environment/.env');

  const u = new URL(poolerUrl);
  u.password = password;
  const connectionString = u.toString();

  const { Client } = pg;
  const client = new Client({ connectionString });

  await client.connect();
  // Run within a transaction for safety; if the SQL contains transactional DDL,
  // Postgres will handle it or error appropriately.
  await client.query('BEGIN;');
  await client.query(sql);
  await client.query('COMMIT;');

  await client.end();
  console.log(`Applied SQL: ${path.basename(sqlFilePath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

