# Web static hosting (Expo export)

Production build: from repo root, `pnpm nx run mobile:build` (or `pnpm run build` in `apps/mobile`). This runs `scripts/generate-sitemap.ts` then `expo export --platform web`. Output is `apps/mobile/dist/`.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Build-time slug discovery for static routes and sitemap |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Same (anon RLS applies) |
| `EXPO_PUBLIC_SITE_URL` | Canonical origin for `sitemap.xml`, `robots.txt`, and Open Graph URLs (no trailing slash) |
| `EXPO_PUBLIC_SITE_NAME` | Site label in metadata (optional) |
| `EXPO_PUBLIC_SITE_DESCRIPTION` | Default meta description (optional) |

If `EXPO_PUBLIC_SITE_URL` is unset during sitemap generation, the script falls back to `https://unicorn.gives` and logs a warning.

## Cache-Control (CDN)

Tune headers at your host. Recommended pattern:

- **Fingerprinted assets** under `dist/_expo/` / hashed JS and CSS: long-lived immutable cache, e.g. `Cache-Control: public, max-age=31536000, immutable`.
- **HTML documents** (`index.html` and route HTML): short TTL or revalidation, e.g. `Cache-Control: public, max-age=0, must-revalidate` or `no-cache`, so content updates appear after deploy without users stuck on stale HTML.

Enable Brotli or gzip at the CDN edge.

## Netlify

`public/_headers` is copied into `dist/` by Expo and applies on Netlify. Adjust origins or paths there if your asset layout differs.

## Cloudflare Pages

Translate the same rules into **Custom Headers** in the Pages project settings, or a `_headers` file if your deployment supports it.
