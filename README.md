# unicorn.gives

Community hub for Clare County, Michigan: **Expo (expo-router)** for web and native, content in-repo and Supabase, with **unicorn.love**-style branding.

## Features

- **unicorn.love branding** — Purple palette, readable typography
- **Expo static web export** — Static HTML routes for SEO (`apps/mobile`)
- **Git-based content** — Markdown and app content in the monorepo
- **Responsive** — Mobile-first layouts
- **Deployment** — AWS: **S3** + **CloudFront** + **Route 53** (DNS on AWS; domain registration stays at your registrar)

## Project structure

```
/
├── apps/
│   ├── mobile/          # Expo app (expo-router) — primary web export
│   └── site/            # (removed) Astro marketing/docs site
├── packages/            # Shared packages (e.g. UI)
├── scripts/             # Scrapers, migrations
├── supabase/            # Supabase config/migrations
├── deploy/
│   └── aws.env.example  # Non-secret AWS resource IDs (copy patterns to `.env`)
└── .github/workflows/   # CI deploy to S3 + CloudFront invalidation
```

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 10.x (`corepack enable`)
- Python 3.8+ (optional, for scraping tools)

## Install

```bash
git clone https://github.com/YOUR_USERNAME/unicorn-gives.git
cd unicorn-gives
pnpm install --frozen-lockfile
```

## Development

```bash
# Expo dev (from monorepo root)
pnpm dev

# Production-like web export (output: apps/mobile/dist)
pnpm build
```

## Content

- App screens and data: `apps/mobile/`
- Content is served from Supabase (managed in Supabase).

## Deployment (AWS)

**Live static site:** S3 bucket → CloudFront → browsers.  
**DNS:** Route 53 hosted zone for `unicorn.gives` (authoritative NS from AWS, set at your **registrar only**).

Reference resource names (see also [deploy/aws.env.example](./deploy/aws.env.example)):

| Resource | Value |
|----------|--------|
| CloudFront URL | `https://d25w74w41kavdz.cloudfront.net` |
| Distribution ID | `ER9WIPUKON9J3` |
| S3 bucket | `unicorn-gives-web-391668783184-1774490745` |
| Route 53 zone ID | `Z06458021X03LCFPVFU9W` |

### Registrar nameservers (required for ACM + apex domain)

At your **registrar** for `unicorn.gives`, set **exactly** these four nameservers (not Google Domains / Cloudflare):

- `ns-1273.awsdns-31.org`
- `ns-52.awsdns-06.com`
- `ns-698.awsdns-23.net`
- `ns-1978.awsdns-55.co.uk`

Until public DNS returns these NS records, **ACM stays `PENDING_VALIDATION`**. After the certificate is **ISSUED**, add **`unicorn.gives`** as an alternate domain name on the CloudFront distribution and attach the ACM certificate (us-east-1), then add Route 53 **alias** `A`/`AAAA` for `unicorn.gives` → the distribution.

### GitHub Actions

On push to `main`, the workflow exports the web app and syncs to S3, then invalidates CloudFront.

**Secrets:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `AWS_CLOUDFRONT_DISTRIBUTION_ID`, plus `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, optional `EXPO_PUBLIC_NEWSLETTER_URL`. (Region is `us-east-1` in the workflow.)

### Manual deploy (same as CI)

```bash
pnpm install --frozen-lockfile
pnpm build   # expo export → apps/mobile/dist
aws s3 sync apps/mobile/dist/ "s3://unicorn-gives-web-391668783184-1774490745/" --delete
aws cloudfront create-invalidation --distribution-id ER9WIPUKON9J3 --paths "/*"
```

## Branding

- Primary: `#6361ad`
- Link: `#7c7ac8`
- Hover: `#47458f`
- Selection: `#c5cde9`

## Tech stack

- **App:** Expo, expo-router, React Native Web
- **Backend / data:** Supabase
- **Hosting:** AWS S3, CloudFront, Route 53, ACM
- **CI:** GitHub Actions

## License

© 2024 Lincoln Township. All rights reserved.

---

Built with [unicorn.love](https://unicorn.love) branding.
