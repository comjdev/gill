/**
 * CloudFront Function: redirect-viewer-request
 * SEO 301 redirects — scalable pattern-based architecture
 *
 * Structure:
 * 1. Exact match    — O(1) object lookup for one-off URLs
 * 2. Pattern rules  — Regex-based, first match wins
 * 3. Trailing slash — directory URLs without a slash (or /index.html) 301 to the slash form
 * 4. Pass-through   — Valid pages continue to origin
 *
 * Canonical targets (never redirect sources; no chains/loops):
 *   /, /melbourne-*-photographer/, /melbourne-photos/, /melbourne-photography-tips/,
 *   /book-lifestyle-photographer-in-melbourne/
 *
 * Files with extensions (sitemap.xml, robots.txt, images) are never slash-redirected.
 * 404 logging: Use Lambda@Edge origin-response (lambda-edge-404-logger/) —
 * CloudFront Functions are not invoked for 4xx responses.
 */
var EXACT = {
  "/about/": "/melbourne-lifestyle-photographer/",
  "/contact/": "/book-lifestyle-photographer-in-melbourne/",
  "/portfolio/": "/melbourne-photos/",
  "/gallery/": "/melbourne-photos/",
  "/comments/feed/": "/",
};
var CATEGORY_MAP = {
  maternity: "/melbourne-maternity-photographer/",
  newborn: "/melbourne-newborn-photographer/",
  family: "/melbourne-family-photographer/",
  wedding: "/melbourne-wedding-photographer/",
};
var RULES = [
  [/^\/blog\/?/, "/melbourne-photography-tips/"],
  [/^\/category\//, "/melbourne-photography-tips/"],
  [/^\/tag\//, "/melbourne-photography-tips/"],
  [/^\/author\//, "/"],
  [/^\/categories\/(maternity|newborn|family|wedding)\/?$/, CATEGORY_MAP],
  [/^\/categories\//, "/"],
  [/^\/family-photographer\/melbourne\/?$/, "/melbourne-family-photographer/"],
  [/^\/newborn-photographer\/melbourne\/?$/, "/melbourne-newborn-photographer/"],
  [/^\/family-photographer-[^\/]+\/?$/, "/melbourne-family-photographer/"],
  [/^\/newborn-photographer-[^\/]+\/?$/, "/melbourne-newborn-photographer/"],
  [/^\/maternity-[^\/]+\/?$/, "/melbourne-maternity-photographer/"],
  [/^\/page\//, "/"],
  [/^\/(404|feed)(\.html)?\/?$/, "/"],
];

function handler(event) {
  var request = event.request;
  var path = normalizePath(request.uri);
  var target = EXACT[path] || matchRules(path);
  if (target) return redirect301(target, request.querystring);

  // S3 website hosting 302s folder URLs without a trailing slash. Google
  // reports those as "Page with redirect" and prefers a permanent 301.
  if (!isAssetUri(request.uri)) {
    var canonical = canonicalDirectoryUri(request.uri);
    if (canonical && canonical !== request.uri) {
      return redirect301(canonical, request.querystring);
    }
  }
  return request;
}

function normalizePath(uri) {
  var p = canonicalDirectoryUri(uri).toLowerCase();
  return p || "/";
}

function canonicalDirectoryUri(uri) {
  var p = uri.replace(/\/index\.html$/i, "/").replace(/\/+/g, "/");
  if (p !== "/" && p !== "" && p.slice(-1) !== "/") p += "/";
  return p;
}

function isAssetUri(uri) {
  if (/\/index\.html$/i.test(uri)) return false;
  var last = uri.split("/").pop();
  return last.indexOf(".") !== -1;
}

function matchRules(path) {
  for (var i = 0; i < RULES.length; i++) {
    var m = path.match(RULES[i][0]);
    if (m) {
      var t = RULES[i][1];
      return typeof t === "object" && m[1] ? t[m[1]] : t;
    }
  }
  return null;
}

function redirect301(target, qs) {
  var str = "";
  if (qs && Object.keys(qs).length > 0) {
    var parts = [];
    for (var k in qs) parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(qs[k].value));
    str = "?" + parts.join("&");
  }
  return {
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: {
      location: { value: "https://gill-photography.com.au" + target + str },
      "cache-control": { value: "max-age=31536000, immutable" },
    },
  };
}

// Test harness (Node.js only; CloudFront has no module)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    handler,
    normalizePath,
    canonicalDirectoryUri,
    isAssetUri,
    matchRules,
    EXACT,
    RULES,
  };
}
