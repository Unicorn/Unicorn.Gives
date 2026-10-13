# CloudFront distribution `ER9WIPUKON9J3` — unicorn.gives

The site is a static export in S3 bucket `unicorn-gives-web-391668783184-1774490745`
served through this distribution. These settings are applied with the AWS CLI
(credentials in the root `.env`); this file is the record of what is set and why.

## Origin and routing

- **Origin:** the bucket via OAC (REST endpoint), so there is no index-document
  behaviour. `DefaultRootObject` is `index.html`.
- **Viewer-request function** `unicorn-gives-rewrite-static-routes`
  (source: `rewrite-static-routes.js`): appends `.html` to extensionless paths and
  `index.html` to trailing slashes so clean URLs hit the exported page; 301s
  `www.unicorn.gives` to the apex, preserving path and query.
  Publish a change with:
  ```bash
  FN=unicorn-gives-rewrite-static-routes
  ET=$(aws cloudfront describe-function --name $FN --query ETag --output text)
  ET=$(aws cloudfront update-function --name $FN --if-match "$ET" \
        --function-config "Comment=Clean URLs -> .html keys; www -> apex,Runtime=cloudfront-js-2.0" \
        --function-code fileb://infra/cloudfront/rewrite-static-routes.js --query ETag --output text)
  aws cloudfront publish-function --name $FN --if-match "$ET"
  ```
- **Custom error responses:** S3 403 and 404 both serve `/404.html` with a real
  **404 status**. `404.html` is a copy of the exported `+not-found.html` made by
  `apps/mobile/scripts/deploy.sh` — the `+` key cannot be used directly because
  S3 decodes it as a space. The page is the same app shell, so client-only deep
  links (`/admin/<id>`, `/bingo/<slug>`) still render after hydration; they just
  carry a 404 status, which is right for search engines. Before 2026-10-13 every
  miss returned `/index.html` with **200**, which hid missing images and made
  every unknown URL a soft-404.

## TLS and domains

- Aliases: `unicorn.gives`, `www.unicorn.gives`.
- Certificate: ACM (us-east-1) covering both names, DNS-validated through the
  Route 53 zone `Z06458021X03LCFPVFU9W`, which also holds the A/AAAA aliases for
  both names pointing at `d25w74w41kavdz.cloudfront.net`.
- Viewer protocol: redirect HTTP to HTTPS. HTTP/2 and IPv6 on.

## Caching and headers

- Compression on. No cache policy is attached; CloudFront honours the
  `Cache-Control` set on each object by `deploy.sh`: hashed assets
  (`_expo/`, `assets/`) are `immutable, max-age=1y`; pages are
  `max-age=0, s-maxage=600, must-revalidate`. Every deploy also invalidates `/*`.
- **Response headers policy:** custom policy `unicorn-gives-security` (`57d88921-bf1f-4d36-9902-67515d7b7a77`),
  replacing the AWS managed `SecurityHeadersPolicy` on 2026-10-13. It sets HSTS 1y
  (includeSubDomains), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and an enforced
  **Content-Security-Policy**:

  ```
  default-src 'self'; script-src 'self' 'sha256-67fhrP0+BkBqmgGGXTtgiVO/9EQs3QruYNU/7fnRkI8='; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://kifhbevwmpqdeuxqnjxa.supabase.co wss://kifhbevwmpqdeuxqnjxa.supabase.co; media-src 'self' https://kifhbevwmpqdeuxqnjxa.supabase.co; frame-src https://maps.google.com https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests
  ```

  What each allowance is for:
  - `script-src 'self'` + one hash: the bundle and route chunks are same-origin;
    the hash is Expo's single inline `globalThis.__EXPO_ROUTER_HYDRATE__=true;`
    module. **If Expo changes that inline script, every page breaks** — recompute
    with `printf '%s' '<script body>' | openssl dgst -sha256 -binary | base64`
    (`scripts/verify-static-output.ts` is the right place to assert the hash).
    The JSON-LD blocks are `application/ld+json` and never execute.
  - `style-src 'unsafe-inline'`: React Native Web renders inline `style`
    attributes and the markdown renderer injects a `<style>`; hashes are not
    practical here.
  - `img-src https:`: CMS image URLs are admin-entered and may point anywhere;
    `data:`/`blob:` cover icons and upload previews.
  - `connect-src`: Supabase REST, Functions, Storage and Realtime (`wss:`) only.
  - `frame-src`: the Google Maps embed on partner contact sections.
  - Everything else is same-origin; `object-src 'none'`, `base-uri 'self'`,
    `frame-ancestors 'self'`, `form-action 'self'`, `upgrade-insecure-requests`.

  Rollout was report-only first (as a custom `Content-Security-Policy-Report-Only`
  header), with the real flows exercised in a browser and the console read for
  violations, then switched to enforcing. Do the same for any change: edit the
  policy with `update-response-headers-policy --if-match <ETag>`; it propagates in
  a few minutes without touching the distribution.

## Changing the distribution

`aws cloudfront get-distribution-config` returns the config plus an `ETag`; edit the
config and send it back with `update-distribution --if-match <ETag>`. Deployment takes
a few minutes (`Status: InProgress`). Keep this file in step with any change.
