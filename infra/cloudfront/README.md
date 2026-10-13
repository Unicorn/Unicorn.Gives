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
- **Response headers policy:** AWS managed `SecurityHeadersPolicy`
  (`67f7725c-6f97-4210-82d7-5512b31e9d03`): HSTS 1y, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`.
  No CSP yet — the app inlines styles and loads Supabase, Square and Google Fonts,
  so a policy needs to be written against those before it can be enforced.

## Changing the distribution

`aws cloudfront get-distribution-config` returns the config plus an `ETag`; edit the
config and send it back with `update-distribution --if-match <ETag>`. Deployment takes
a few minutes (`Status: InProgress`). Keep this file in step with any change.
