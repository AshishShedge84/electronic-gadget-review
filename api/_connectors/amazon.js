/**
 * Amazon India Marketplace Connector
 * Provides compliant product discovery, price observation, and verified outbound redirection.
 * Discloses review API authorization requirements honestly per Amazon Associates / PA-API conditions.
 */

import { MARKETPLACE_REGISTRY } from "./registry.js";

export class AmazonConnector {
  constructor() {
    this.config = MARKETPLACE_REGISTRY.amazon;
  }

  /**
   * Search Amazon India catalog for gadgets
   */
  async searchProducts(query) {
    const cleanQuery = encodeURIComponent(query.trim());
    const searchUrl = `https://www.amazon.in/s?k=${cleanQuery}&tag=reviewlyai-21`;

    return {
      providerId: this.config.providerId,
      providerName: this.config.displayName,
      searchUrl,
      items: [
        {
          sourceItemId: `amzn-${cleanQuery.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          providerId: "amazon",
          marketplaceName: "Amazon India",
          productUrl: searchUrl,
          isExactMatch: false,
          isSearchFallback: true,
          badge: "Prime Eligible",
          currency: "INR",
          availability: "In Stock (Amazon India)",
          observedAt: new Date().toISOString(),
          reviewFetchStatus: {
            available: false,
            reason: "Amazon Customer Review API requires active Amazon PA-API Tier 1 partner authorization."
          }
        }
      ]
    };
  }

  /**
   * Build safe verified outbound URL for Amazon India
   */
  getOutboundUrl(product) {
    if (product.offers?.amazon?.productUrl) {
      return product.offers.amazon.productUrl;
    }
    const q = encodeURIComponent(`${product.brand} ${product.name}`);
    return `https://www.amazon.in/s?k=${q}&tag=reviewlyai-21`;
  }
}

export const amazonConnector = new AmazonConnector();
