/**
 * Test suite for redirect-viewer-request CloudFront Function
 * Run: node cloudfront/functions/redirect-viewer-request/test.js
 *
 * Tests: EXACT, patterns, pass-through, query strings, case, edge cases
 */
/* eslint-disable no-undef */

// Inline the function logic for testing (matches production index.js)
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

function normalizePath(uri) {
  var p = uri.replace(/\/index\.html$/i, "/").replace(/\/+/g, "/").toLowerCase();
  if (p !== "/" && p !== "" && p.slice(-1) !== "/") p += "/";
  return p;
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

function resolveRedirect(path) {
  return EXACT[path] || matchRules(path);
}

function mockHandler(uri, querystring) {
  var path = normalizePath(uri);
  var target = resolveRedirect(path);
  if (!target) return { passThrough: true };
  var qs = "";
  if (querystring && Object.keys(querystring).length > 0) {
    var parts = [];
    for (var k in querystring) {
      var v = querystring[k] && typeof querystring[k] === "object" && querystring[k].value !== undefined
        ? querystring[k].value : querystring[k];
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
    qs = "?" + parts.join("&");
  }
  return {
    statusCode: 301,
    location: "https://gill-photography.com.au" + target + qs,
  };
}

// Test runner
var passed = 0;
var failed = 0;

function assertRedirect(uri, expectedTarget, qs) {
  var result = mockHandler(uri, qs);
  if (result.passThrough) {
    console.error("FAIL: " + uri + " → expected redirect to " + expectedTarget + ", got pass-through");
    failed++;
    return;
  }
  var expected = "https://gill-photography.com.au" + expectedTarget + (qs ? "?" + Object.keys(qs).map(function (k) { return k + "=" + qs[k]; }).join("&") : "");
  var actual = result.location;
  if (actual !== expected && !(expectedTarget === "/" && actual.startsWith("https://gill-photography.com.au/?"))) {
    var qsStr = qs ? "?" + Object.keys(qs).map(function (k) { return k + "=" + encodeURIComponent(qs[k]); }).join("&") : "";
    if (actual !== "https://gill-photography.com.au" + expectedTarget + qsStr) {
      console.error("FAIL: " + uri + " → expected " + expectedTarget + ", got " + actual);
      failed++;
      return;
    }
  }
  passed++;
}

function assertPassThrough(uri) {
  var result = mockHandler(uri, {});
  if (!result.passThrough) {
    console.error("FAIL: " + uri + " → expected pass-through, got redirect to " + result.location);
    failed++;
    return;
  }
  passed++;
}

// ——— EXACT REDIRECTS ———
console.log("\n=== EXACT REDIRECTS ===");
assertRedirect("/about", "/melbourne-lifestyle-photographer/");
assertRedirect("/about/", "/melbourne-lifestyle-photographer/");
assertRedirect("/About/", "/melbourne-lifestyle-photographer/");
assertRedirect("/contact", "/book-lifestyle-photographer-in-melbourne/");
assertRedirect("/contact/", "/book-lifestyle-photographer-in-melbourne/");
assertRedirect("/portfolio", "/melbourne-photos/");
assertRedirect("/portfolio/", "/melbourne-photos/");
assertRedirect("/gallery", "/melbourne-photos/");
assertRedirect("/gallery/", "/melbourne-photos/");
assertRedirect("/comments/feed", "/");
assertRedirect("/comments/feed/", "/");

// ——— PATTERN: Legacy blog ———
console.log("\n=== PATTERN: Legacy blog ===");
assertRedirect("/blog", "/melbourne-photography-tips/");
assertRedirect("/blog/", "/melbourne-photography-tips/");
assertRedirect("/blog/old-post/", "/melbourne-photography-tips/");
assertRedirect("/category/lifestyle/", "/melbourne-photography-tips/");
assertRedirect("/tag/family/", "/melbourne-photography-tips/");
assertRedirect("/author/gill/", "/");

// ——— PATTERN: Categories ———
console.log("\n=== PATTERN: Categories ===");
assertRedirect("/categories/maternity/", "/melbourne-maternity-photographer/");
assertRedirect("/categories/Maternity/", "/melbourne-maternity-photographer/");
assertRedirect("/categories/newborn/", "/melbourne-newborn-photographer/");
assertRedirect("/categories/family/", "/melbourne-family-photographer/");
assertRedirect("/categories/wedding/", "/melbourne-wedding-photographer/");
assertRedirect("/categories/", "/");
assertRedirect("/categories/uncategorized/", "/");

// ——— PATTERN: Location consolidation ———
console.log("\n=== PATTERN: Location consolidation ===");
assertRedirect("/family-photographer/melbourne", "/melbourne-family-photographer/");
assertRedirect("/family-photographer/melbourne/", "/melbourne-family-photographer/");
assertRedirect("/newborn-photographer/melbourne", "/melbourne-newborn-photographer/");
assertRedirect("/newborn-photographer/melbourne/", "/melbourne-newborn-photographer/");

// ——— PATTERN: Legacy photographer (hyphen) ———
console.log("\n=== PATTERN: Legacy photographer ===");
assertRedirect("/family-photographer-melbourne/", "/melbourne-family-photographer/");
assertRedirect("/family-photographer-eastern-suburbs/", "/melbourne-family-photographer/");
assertRedirect("/newborn-photographer-melbourne/", "/melbourne-newborn-photographer/");
assertRedirect("/maternity-photographer-melbourne/", "/melbourne-maternity-photographer/");
assertRedirect("/maternity-photos-olinda/", "/melbourne-maternity-photographer/");

// ——— PATTERN: Technical ———
console.log("\n=== PATTERN: Technical ===");
assertRedirect("/page/2/", "/");
assertRedirect("/page/10/", "/");
assertRedirect("/404", "/");
assertRedirect("/404/", "/");
assertRedirect("/404.html", "/");
assertRedirect("/feed", "/");
assertRedirect("/feed/", "/");

// ——— PASS-THROUGH: Valid suburb pages (must NOT redirect) ———
// /family-photographer/melbourne/ and /newborn-photographer/melbourne/ intentionally REDIRECT (consolidation)
console.log("\n=== PASS-THROUGH: Valid suburbs ===");
assertPassThrough("/family-photographer/camberwell/");
assertPassThrough("/family-photographer/balwyn/");
assertRedirect("/family-photographer/melbourne/", "/melbourne-family-photographer/");
assertPassThrough("/family-photographer/blackburn/");
assertPassThrough("/newborn-photographer/burwood/");
assertRedirect("/newborn-photographer/melbourne/", "/melbourne-newborn-photographer/");
assertPassThrough("/newborn-photographer/camberwell/");
assertPassThrough("/maternity-photographer/camberwell/");
assertPassThrough("/maternity-photographer/hawthorn/");

// ——— PASS-THROUGH: Canonical pages ———
console.log("\n=== PASS-THROUGH: Canonical pages ===");
assertPassThrough("/");
assertPassThrough("/melbourne-family-photographer/");
assertPassThrough("/melbourne-newborn-photographer/");
assertPassThrough("/melbourne-maternity-photographer/");
assertPassThrough("/melbourne-wedding-photographer/");
assertPassThrough("/melbourne-photos/");
assertPassThrough("/melbourne-photography-tips/");
assertPassThrough("/melbourne-photography-tips/summer-sunset-sessions-the-best-time-and-locations-around-melbourne-for-outdoor-family-photos");
assertPassThrough("/melbourne-photos/family-dragons-nests/");
assertPassThrough("/book-lifestyle-photographer-in-melbourne/");
assertPassThrough("/photography-faqs-melbourne");
assertPassThrough("/melbourne-lifestyle-photography/");

// ——— Query string preservation (CloudFront format: { key: { value: "..." } }) ———
console.log("\n=== Query string preservation ===");
var qs = { utm_source: { value: "google" }, ref: { value: "ahrefs" } };
var result = mockHandler("/about", qs);
if (!result.location || result.location.indexOf("utm_source=google") === -1 || result.location.indexOf("ref=ahrefs") === -1) {
  console.error("FAIL: Query string not preserved for /about");
  failed++;
} else {
  passed++;
}

// ——— Normalization: index.html, double slash ———
console.log("\n=== Normalization ===");
assertRedirect("/about/index.html", "/melbourne-lifestyle-photographer/");
assertRedirect("//about//", "/melbourne-lifestyle-photographer/");

// ——— No chains/loops: canonical URLs must pass through (never redirect) ———
console.log("\n=== No chains/loops ===");
var canonicalTargets = ["/", "/melbourne-family-photographer/", "/melbourne-newborn-photographer/", "/melbourne-photos/", "/melbourne-photography-tips/", "/book-lifestyle-photographer-in-melbourne/"];
for (var j = 0; j < canonicalTargets.length; j++) {
  var res = mockHandler(canonicalTargets[j], null);
  if (!res.passThrough) {
    console.error("FAIL: Chain/loop - canonical " + canonicalTargets[j] + " would redirect to " + res.location);
    failed++;
  } else {
    passed++;
  }
}

// ——— Production handler verification ———
console.log("\n=== Production handler verification ===");
try {
  var prod = require("./index.js");
  var r1 = prod.handler({ request: { uri: "/about", querystring: {} } });
  var r2 = prod.handler({ request: { uri: "/melbourne-family-photographer/", querystring: {} } });
  var r3 = prod.handler({ request: { uri: "/about", querystring: { utm: { value: "test" } } } });
  if (r1.statusCode !== 301) { console.error("FAIL: Production redirect"); failed++; } else passed++;
  if (r2.statusCode) { console.error("FAIL: Production pass-through"); failed++; } else passed++;
  if (!r3.headers.location.value.includes("utm=test")) { console.error("FAIL: Production query string"); failed++; } else passed++;
  console.log("Production handler: OK");
} catch (e) {
  console.error("FAIL: Could not load production handler:", e.message);
  failed++;
}

// ——— Summary ———
console.log("\n=== SUMMARY ===");
console.log("Passed: " + passed);
console.log("Failed: " + failed);
process.exit(failed > 0 ? 1 : 0);
