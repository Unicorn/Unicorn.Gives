/**
 * CloudFront viewer-request function: map clean URLs onto S3 object keys and
 * send www to the apex.
 *
 * The bucket is served through an OAC REST origin, which has no index-document
 * behaviour, so `/guides/dog-license` and `/partners/the-mane` would both 404
 * and fall through to the SPA shell. The build emits `<route>.html` for every
 * page (see scripts/normalize-static-routes.ts), so appending `.html` to any
 * extensionless path resolves them all.
 *
 * A miss falls through to CloudFront's custom error response, which serves
 * /+not-found.html with a real 404 status. The not-found page is the same
 * app shell, so client-only deep links (admin/[id], bingo/[slug]) still render
 * once the app hydrates — they just carry a 404 status, which is what search
 * engines should see for them anyway.
 */
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers.host && request.headers.host.value;

  if (host === 'www.unicorn.gives') {
    var qs = '';
    var keys = Object.keys(request.querystring);
    for (var i = 0; i < keys.length; i++) {
      qs += (i === 0 ? '?' : '&') + keys[i] + '=' + request.querystring[keys[i]].value;
    }
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://unicorn.gives' + uri + qs } },
    };
  }

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
