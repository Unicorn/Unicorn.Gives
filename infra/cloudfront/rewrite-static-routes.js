/**
 * CloudFront viewer-request function: map clean URLs onto S3 object keys.
 *
 * The bucket is served through an OAC REST origin, which has no index-document
 * behaviour, so `/guides/dog-license` and `/partners/the-mane` would both 404
 * and fall through to the SPA shell. The build emits `<route>.html` for every
 * page (see scripts/normalize-static-routes.ts), so appending `.html` to any
 * extensionless path resolves them all.
 *
 * A miss still falls back to CloudFront's 404 -> /index.html rule, i.e. the
 * previous client-routed behaviour, so this cannot make routing worse.
 */
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === '/') {
    return request; // DefaultRootObject serves index.html
  }

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
    return request;
  }

  var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
  if (lastSegment.indexOf('.') === -1) {
    request.uri = uri + '.html';
  }

  return request;
}
