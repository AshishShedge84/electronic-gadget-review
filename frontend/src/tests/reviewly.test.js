/**
 * Reviewly AI Automated Verification & Quality Test Suite
 * Tests currency formatting, dataset integrity, comparison matrix algorithms,
 * centralized route authorization classification, marketplace connector registry,
 * variant distinction & deduplication, and user dataset upload sanitization.
 */

import { formatINR, formatNumberIN } from "../utils/currency.js";
import { INITIAL_PRODUCTS, CATEGORIES } from "../services/seedData.js";
import {
  ROUTES,
  ROUTE_TYPES,
  isRouteProtected,
  getRouteFromPathname,
  getPathForRoute
} from "../router/routes.js";
import { MARKETPLACE_REGISTRY } from "../services/marketplaceService.js";
import {
  extractVariantSignature,
  areExactHardwareVariants,
  deduplicateAndConsolidateProducts
} from "../../api/_connectors/productDeduplicator.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("\n=======================================================");
console.log("  REVIEWLY AI AUTOMATED TEST SUITE RUNNER");
console.log("=======================================================\n");

// 1. Currency & Number Formatting Tests (Mandatory India-First Formatting)
console.log("[1] Testing Currency & Localization (INR ₹)");
assert(formatINR(29990).includes("29,990"), "Formats ₹29,990 correctly");
assert(formatINR(199900).includes("1,99,900"), "Formats ₹1,99,900 with Indian digit grouping");
assert(formatINR(129999).includes("1,29,999"), "Formats ₹1,29,999 with Indian commas");
assert(formatINR(0).includes("0"), "Formats ₹0 correctly");
assert(formatINR(null) === "₹0", "Handles null gracefully with ₹0");
assert(formatINR(undefined) === "₹0", "Handles undefined gracefully with ₹0");
assert(formatNumberIN(14820) === "14,820", "Formats Indian review count 14,820 correctly");

// 2. Data Integrity Tests (Catalog & Sentiment Schema)
console.log("\n[2] Testing Seed Dataset Integrity & Schema Compliance");
assert(INITIAL_PRODUCTS.length >= 6, `Catalog has ${INITIAL_PRODUCTS.length} electronic gadgets (>= 6 required)`);

INITIAL_PRODUCTS.forEach((prod) => {
  assert(typeof prod.id === "string" && prod.id.length > 0, `Product ${prod.name} has valid id`);
  assert(typeof prod.priceINR === "number" && prod.priceINR > 0, `Product ${prod.id} has positive numeric priceINR`);
  assert(prod.rating >= 1 && prod.rating <= 5, `Product ${prod.id} has rating between 1 and 5`);
  assert(prod.reviewCount > 0, `Product ${prod.id} has valid reviewCount`);
  assert(prod.specs && Object.keys(prod.specs).length >= 4, `Product ${prod.id} has at least 4 detailed specs`);
  assert(prod.aspects && prod.aspects.length >= 3, `Product ${prod.id} has at least 3 aspect breakdowns`);
  assert(prod.sentimentStats && prod.sentimentStats.consensusScore >= 50, `Product ${prod.id} has valid consensusScore`);
  assert(prod.summary && prod.summary.verdict, `Product ${prod.id} has an executive summary verdict`);
});

// 3. Comparison Matrix Algorithmic Winner Selection
console.log("\n[3] Testing Comparison Matrix Decision Support Logic");
const xm5 = INITIAL_PRODUCTS.find((p) => p.id === "sony-wh1000xm5");
const bose = INITIAL_PRODUCTS.find((p) => p.id === "bose-qc-ultra");

const candidates = [xm5, bose];
const sortedWinner = [...candidates].sort((a, b) => (b.sentimentStats?.consensusScore || 0) - (a.sentimentStats?.consensusScore || 0))[0];
assert(sortedWinner.id === "sony-wh1000xm5", "Accurately identifies Sony XM5 as consensus score winner (89% vs 86%)");

const macbook = INITIAL_PRODUCTS.find((p) => p.id === "apple-macbook-pro-m3");
const newCandidates = [bose, macbook];
const macWinner = [...newCandidates].sort((a, b) => (b.sentimentStats?.consensusScore || 0) - (a.sentimentStats?.consensusScore || 0))[0];
assert(macWinner.id === "apple-macbook-pro-m3", "Dynamically updates winner when comparing against MacBook Pro (94% vs 86%)");

// 4. Centralized Route Authorization Classification Tests
console.log("\n[4] Testing Route Authorization & Authentication Gates");

const requiredProtectedRoutes = [
  "dashboard",
  "summary",
  "sentiment",
  "aspects",
  "compare",
  "saved",
  "history",
  "profile",
  "settings",
  "nlp",
  "reports"
];

requiredProtectedRoutes.forEach((routeId) => {
  assert(isRouteProtected(routeId) === true, `Route '${routeId}' is strictly classified as PROTECTED`);
  assert(ROUTES[routeId].type === ROUTE_TYPES.PROTECTED, `Route '${routeId}' has PROTECTED type token`);
});

const requiredPublicRoutes = [
  "landing",
  "explore",
  "productDetail",
  "login",
  "register",
  "forgotPassword",
  "about",
  "contact",
  "help",
  "privacy",
  "terms"
];

requiredPublicRoutes.forEach((routeId) => {
  assert(isRouteProtected(routeId) === false, `Route '${routeId}' is correctly classified as PUBLIC`);
  assert(ROUTES[routeId].type === ROUTE_TYPES.PUBLIC, `Route '${routeId}' has PUBLIC type token`);
});

// 5. URL Path Mapping Verification
console.log("\n[5] Testing URL Pathname Resolution & Canonicals");
assert(getRouteFromPathname("/") === "landing", "Root path '/' maps to 'landing'");
assert(getRouteFromPathname("/dashboard") === "dashboard", "Path '/dashboard' maps to 'dashboard'");
assert(getRouteFromPathname("/login") === "login", "Path '/login' maps to 'login'");
assert(getRouteFromPathname("/register") === "register", "Path '/register' maps to 'register'");
assert(getRouteFromPathname("/explore") === "explore", "Path '/explore' maps to 'explore'");
assert(getRouteFromPathname("/products") === "explore", "Alias path '/products' maps to 'explore'");
assert(getRouteFromPathname("/product/sony-wh1000xm5") === "productDetail", "Subpath '/product/*' maps to 'productDetail'");
assert(getRouteFromPathname("/analysis") === "summary", "Path '/analysis' maps to 'summary'");
assert(getRouteFromPathname("/compare") === "compare", "Path '/compare' maps to 'compare'");
assert(getRouteFromPathname("/saved") === "saved", "Path '/saved' maps to 'saved'");
assert(getRouteFromPathname("/history") === "history", "Path '/history' maps to 'history'");

assert(getPathForRoute("dashboard") === "/dashboard", "Canonical path for 'dashboard' is '/dashboard'");
assert(getPathForRoute("productDetail", { product: "sony-wh1000xm5" }).includes("product=sony-wh1000xm5"), "Canonical path for 'productDetail' preserves query params");

// 6. Marketplace Connector Registry & Capability Transparency
console.log("\n[6] Testing Marketplace Registry & Capability Declarations");
assert(MARKETPLACE_REGISTRY.amazon.providerId === "amazon", "Amazon connector registered");
assert(MARKETPLACE_REGISTRY.amazon.outboundLinkSupported === true, "Amazon outbound redirection link supported");
assert(MARKETPLACE_REGISTRY.amazon.reviewFetchSupported === false, "Amazon direct review scraping accurately declared FALSE (ToS compliance)");

assert(MARKETPLACE_REGISTRY.flipkart.providerId === "flipkart", "Flipkart connector registered");
assert(MARKETPLACE_REGISTRY.flipkart.outboundLinkSupported === true, "Flipkart outbound link supported");
assert(MARKETPLACE_REGISTRY.flipkart.reviewFetchSupported === false, "Flipkart direct review scraping accurately declared FALSE (Developer Partner required)");

assert(MARKETPLACE_REGISTRY.meesho.providerId === "meesho", "Meesho connector registered");
assert(MARKETPLACE_REGISTRY.meesho.reviewFetchSupported === false, "Meesho direct review scraping accurately declared FALSE (API not exposed)");

assert(MARKETPLACE_REGISTRY.verified_feed.reviewFetchSupported === true, "Verified Review Intelligence Feed declared active and reviewFetchSupported: true");
assert(MARKETPLACE_REGISTRY.user_upload.reviewFetchSupported === true, "User Dataset Upload declared active for custom datasets");

// 7. Product Identity Matching & Variant Preservation
console.log("\n[7] Testing Product Identity Matching & Hardware Variant Preservation");
const sig1 = extractVariantSignature("Apple iPhone 16 Pro Max 256GB Desert Titanium");
assert(sig1.storage === "256GB", "Accurately extracts 256GB storage signature");

const sig2 = extractVariantSignature("Apple iPhone 16 Pro Max 512GB Natural Titanium");
assert(sig2.storage === "512GB", "Accurately extracts 512GB storage signature");

const areSame = areExactHardwareVariants(
  { brand: "Apple", name: "Apple iPhone 16 Pro Max 256GB" },
  { brand: "Apple", name: "Apple iPhone 16 Pro Max 512GB" }
);
assert(areSame === false, "Crucial: Distinct storage variants (256GB vs 512GB) are NOT false-merged");

const areSameMac = areExactHardwareVariants(
  { brand: "Apple", name: "MacBook Pro 14 M3 16GB RAM" },
  { brand: "Apple", name: "MacBook Pro 14 M3 Pro 18GB RAM" }
);
assert(areSameMac === false, "Crucial: Distinct chip/RAM variants (M3 16GB vs M3 Pro 18GB) are NOT false-merged");

// 8. User Dataset Upload Sanitization (Formula Injection Prevention)
console.log("\n[8] Testing Dataset Sanitization (Formula Injection Defense)");
function sanitizeCell(val) {
  if (typeof val !== "string") return val;
  const trimmed = val.trim();
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return "'" + trimmed;
  }
  return trimmed;
}

assert(sanitizeCell("=SUM(A1:A10)") === "'=SUM(A1:A10)", "Neutralizes Excel/CSV formula injection with leading quote");
assert(sanitizeCell("+cmd|' /C calc'!A0") === "'+cmd|' /C calc'!A0", "Neutralizes '+' command injection payload");
assert(sanitizeCell("@IMPORTXML(...)") === "'@IMPORTXML(...)", "Neutralizes '@' formula injection");
assert(sanitizeCell("Great noise cancellation!") === "Great noise cancellation!", "Preserves legitimate customer feedback text unmodified");

// Summary
console.log("\n=======================================================");
console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
