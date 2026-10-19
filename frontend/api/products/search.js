/**
 * Multi-Marketplace Product Search Serverless Endpoint
 * Queries verified gadget intelligence feeds and major Indian marketplaces concurrently.
 * Normalizes, deduplicates, and annotates results with real capabilities.
 */

import { verifiedFeedConnector } from "../connectors/verifiedFeed.js";
import { amazonConnector } from "../connectors/amazon.js";
import { flipkartConnector } from "../connectors/flipkart.js";
import { meeshoConnector } from "../connectors/meesho.js";
import { deduplicateAndConsolidateProducts } from "../connectors/productDeduplicator.js";
import { getRegisteredProviders } from "../connectors/registry.js";

export default async function handler(req, res) {
  // CORS setup
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  try {
    const { q = "", category = "all", marketplace = "all" } = req.query;

    const queryStr = q.trim();

    // 1. Query Verified Review Feed
    const verifiedResults = await verifiedFeedConnector.searchProducts(queryStr, category);

    // 2. Query Marketplace Connectors for search URLs and offer tracking
    let marketplaceItems = [];
    if (queryStr) {
      const [amzRes, fkRes, meeshoRes] = await Promise.all([
        marketplace === "all" || marketplace === "amazon" ? amazonConnector.searchProducts(queryStr) : null,
        marketplace === "all" || marketplace === "flipkart" ? flipkartConnector.searchProducts(queryStr) : null,
        marketplace === "all" || marketplace === "meesho" ? meeshoConnector.searchProducts(queryStr) : null
      ]);

      if (amzRes) marketplaceItems.push(...amzRes.items);
      if (fkRes) marketplaceItems.push(...fkRes.items);
      if (meeshoRes) marketplaceItems.push(...meeshoRes.items);
    }

    // 3. Deduplicate and consolidate across sources
    const consolidatedProducts = deduplicateAndConsolidateProducts(verifiedResults);

    res.status(200).json({
      status: "success",
      query: queryStr,
      category,
      totalMatches: consolidatedProducts.length,
      providers: getRegisteredProviders(),
      products: consolidatedProducts,
      marketplaceFallbacks: marketplaceItems
    });
  } catch (err) {
    console.error("Search API error:", err);
    res.status(500).json({
      error: "Failed to perform product search",
      details: err.message
    });
  }
}
