#!/usr/bin/env bash
# Sync AI keys to Supabase Edge Function secrets (never commit real values).
#
# 1. Create supabase/.secrets.local (gitignored) with:
#      GEMINI_API_KEY=your_key
#    Optional: OPENAI_API_KEY=sk-...
# 2. Run from repo root:
#      ./scripts/sync-supabase-ai-secrets.sh
#
# Requires: supabase CLI logged in; supabase/.temp/project-ref from `supabase link`.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REF_FILE="$ROOT/supabase/.temp/project-ref"
ENV_FILE="${1:-$ROOT/supabase/.secrets.local}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — create it with GEMINI_API_KEY=..." >&2
  exit 1
fi
if [[ ! -f "$REF_FILE" ]]; then
  echo "Missing $REF_FILE — run: supabase link" >&2
  exit 1
fi
REF="$(tr -d '[:space:]' < "$REF_FILE")"
supabase secrets set --env-file "$ENV_FILE" --project-ref "$REF"
echo "Secrets synced from $ENV_FILE to project $REF"
