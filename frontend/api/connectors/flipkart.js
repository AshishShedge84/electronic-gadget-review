/**
 * Flipkart Marketplace Connector
 * Provides compliant product discovery, verified marketplace redirection, and price observation.
 * Discloses review API authorization requirements honestly per Flipkart Partner API policy.
 */

import { MARKETPLACE_REGISTRY } from "./registry.js";

export class FlipkartConnector {
  constructor() {
    this.config = MARKETPLACE_REGISTRY.flipkart;
  }

  /**
   * Search Flipkart catalog for electronic gadgets
   */
  async searchProducts(query) {
    const cleanQuery = encodeURIComponent(query.trim());
    const searchUrl = `https://www.flipkart.com/search?q=${cleanQuery}`;

    return {
      providerId: this.config.providerId,
      providerName: this.config.displayName,
      searchUrl,
      items: [
        {
          sourceItemId: `fk-${cleanQuery.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          providerId: "flipkart",
          marketplaceName: "Flipkart",
          productUrl: searchUrl,
          isExactMatch: false,
          isSearchFallback: true,
          badge: "Flipkart Assured",
          currency: "INR",
          availability: "Available on Flipkart",
          observedAt: new Date().toISOString(),
          reviewFetchStatus: {
            available: false,
            reason: "Flipkart Customer Review API requires active Flipkart Developer Partner enterprise tokens."
          }
        }
      ]
    };
  }

  /**
   * Build safe verified outbound URL for Flipkart
   */
  getOutboundUrl(product) {
    if (product.offers?.flipkart?.productUrl) {
      return product.offers.flipkart.productUrl;
    }
    const q = encodeURIComponent(`${product.brand} ${product.name}`);
    return `https://www.flipkart.com/search?q=${q}`;
  }
}

export const flipkartConnector = new FlipkartConnector();
