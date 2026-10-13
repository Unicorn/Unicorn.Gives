#!/usr/bin/env bash
# Deploy apps/mobile/dist to S3 + CloudFront with correct Cache-Control.
#
# Hashed assets (_expo/, assets/) are immutable for a year; pages revalidate on
# every visit but may be served from CloudFront for 10 minutes, which the
# invalidation below cuts short on deploy. Run from the repo root after
# `pnpm nx run mobile:build`; AWS credentials come from the root .env.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
DIST="$ROOT/apps/mobile/dist"
BUCKET="s3://unicorn-gives-web-391668783184-1774490745"
DISTRIBUTION="ER9WIPUKON9J3"
IMMUTABLE="public, max-age=31536000, immutable"
PAGES="public, max-age=0, s-maxage=600, must-revalidate"

[ -f "$DIST/index.html" ] || { echo "No build at $DIST — run: pnpm nx run mobile:build" >&2; exit 1; }
set -a; . "$ROOT/.env"; set +a

# Refuse to delete real pages: only hashed bundles and `[param]` shells may go.
deletions=$(aws s3 sync "$DIST/" "$BUCKET" --delete --dryrun | grep '^(dryrun) delete:' | sed "s|.*1774490745/||" | grep -v '\[' | grep -v '^_expo/' || true)
if [ -n "$deletions" ]; then
  echo "Refusing to deploy: this would delete real routes:" >&2; echo "$deletions" >&2; exit 1
fi

aws s3 sync "$DIST/" "$BUCKET" --delete --exclude "*" --include "_expo/*" --include "assets/*" --cache-control "$IMMUTABLE"
aws s3 sync "$DIST/" "$BUCKET" --delete --exclude "_expo/*" --exclude "assets/*" --cache-control "$PAGES"

id=$(aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION" --paths "/*" --query 'Invalidation.Id' --output text)
echo "Invalidation $id created; waiting…"
aws cloudfront wait invalidation-completed --distribution-id "$DISTRIBUTION" --id "$id"
echo "Deployed."
