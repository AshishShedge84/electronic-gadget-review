/**
 * Reviewly AI — Marketplace & Data Source Capability Registry
 * Explicitly declares capabilities, origin types, authorization status, and data support for each provider.
 * Follows strict compliance and truthfulness rules:
 * - Distinguishes live network feeds from bundled reference seed datasets.
 * - Distinguishes search fallback links from verified exact product-page links.
 * - Explicitly marks review scraping as restricted/unsupported where platform terms prohibit it.
 */

export const MARKETPLACE_REGISTRY = {
  amazon: {
    providerId: "amazon",
    displayName: "Amazon India",
    domain: "amazon.in",
    logoColor: "#FF9900",
    isConfigured: true,
    originType: "marketplace_connector",
    isExternalLiveFeed: false,
    productSearchSupported: true,
    productDetailsSupported: true,
    priceSupported: true,
    imageSupported: true,
    reviewFetchSupported: false, // Amazon Customer Reviews require Amazon Product Advertising API (PA-API) with active sales tier
    reviewAnalysisAllowed: false,
    outboundLinkSupported: true,
    outboundLinkType: "search_query_fallback", // Generated search URL, not guaranteed single-seller listing
    requiresCredentials: true,
    credentialName: "AMAZON_PA_API_KEY",
    affiliateTagStatus: "placeholder (reviewlyai-21) - Replace with approved Amazon Associates ID",
    configurationHelp: "Amazon product search and outbound buy links are enabled. Direct customer review harvesting via scraping is strictly prohibited by Amazon Conditions of Use; official customer reviews require Amazon PA-API with Associates Tier 1+ credentials.",
    lastSuccessfulFetchAt: null,
    statusMessage: "Search redirect active. Direct review scraping prohibited by Amazon terms; official PA-API Tier 1 required."
  },

  flipkart: {
    providerId: "flipkart",
    displayName: "Flipkart",
    domain: "flipkart.com",
    logoColor: "#2874F0",
    isConfigured: true,
    originType: "marketplace_connector",
    isExternalLiveFeed: false,
    productSearchSupported: true,
    productDetailsSupported: true,
    priceSupported: true,
    imageSupported: true,
    reviewFetchSupported: false, // Flipkart Affiliate API v1.0 provides search and pricing; full review feeds require Flipkart Seller Partner or Enterprise Data agreement
    reviewAnalysisAllowed: false,
    outboundLinkSupported: true,
    outboundLinkType: "search_query_fallback",
    requiresCredentials: true,
    credentialName: "FLIPKART_AFFILIATE_TOKEN",
    configurationHelp: "Flipkart product search and outbound links are active. Customer review ingestion requires Flipkart Enterprise Developer Partner access.",
    lastSuccessfulFetchAt: null,
    statusMessage: "Search redirect active. Customer review API requires Flipkart Developer Partner agreement."
  },

  meesho: {
    providerId: "meesho",
    displayName: "Meesho",
    domain: "meesho.com",
    logoColor: "#9C27B0",
    isConfigured: true,
    originType: "marketplace_connector",
    isExternalLiveFeed: false,
    productSearchSupported: true,
    productDetailsSupported: true,
    priceSupported: true,
    imageSupported: true,
    reviewFetchSupported: false, // Meesho currently does not offer a public third-party review retrieval API
    reviewAnalysisAllowed: false,
    outboundLinkSupported: true,
    outboundLinkType: "search_query_fallback",
    requiresCredentials: false,
    configurationHelp: "Meesho product search links are supported. Public review ingestion API is not exposed by Meesho.",
    lastSuccessfulFetchAt: null,
    statusMessage: "Search redirect active. Meesho does not provide a public customer review API."
  },

  verified_feed: {
    providerId: "verified_feed",
    displayName: "Bundled Curated Reference Dataset",
    domain: "local-bundled",
    logoColor: "#0071E3",
    isConfigured: true,
    originType: "bundled_seed_dataset",
    isExternalLiveFeed: false, // TRUTHFUL DECLARATION: Static curated reference data bundled in repository
    productSearchSupported: true,
    productDetailsSupported: true,
    priceSupported: true,
    imageSupported: true,
    reviewFetchSupported: true, // Supported from local seed catalog for exploration & testing
    reviewAnalysisAllowed: true,
    outboundLinkSupported: false,
    requiresCredentials: false,
    configurationHelp: "Bundled reference dataset located in frontend/src/services/seedData.js. Used for catalog exploration, comparison matrix, and NLP engine benchmarking. Not an external live network service.",
    lastSuccessfulFetchAt: new Date().toISOString(),
    statusMessage: "Loaded from local repository seed dataset (6 electronic gadgets). For live custom reviews, use User Dataset Upload."
  },

  user_upload: {
    providerId: "user_upload",
    displayName: "User Dataset Upload (CSV/JSON)",
    domain: "local-upload",
    logoColor: "#34C759",
    isConfigured: true,
    originType: "user_dataset_upload",
    isExternalLiveFeed: false,
    productSearchSupported: false,
    productDetailsSupported: false,
    priceSupported: false,
    imageSupported: false,
    reviewFetchSupported: true,
    reviewAnalysisAllowed: true,
    outboundLinkSupported: false,
    requiresCredentials: false,
    configurationHelp: "User-imported CSV/JSON review datasets with interactive column mapping, formula injection protection, and provenance attribution.",
    lastSuccessfulFetchAt: null,
    statusMessage: "Available on-demand for custom CSV/JSON customer review files."
  }
};

/**
 * Get all active marketplace connectors
 */
export function getRegisteredProviders() {
  return Object.values(MARKETPLACE_REGISTRY);
}

/**
 * Get provider capability descriptor by ID
 */
export function getProviderById(providerId) {
  return MARKETPLACE_REGISTRY[providerId] || null;
}
