/**
 * Meesho Marketplace Connector
 * Provides compliant product discovery and verified redirection links.
 * Discloses that Meesho does not offer an authorized third-party review retrieval API.
 */

import { MARKETPLACE_REGISTRY } from "./registry.js";

export class MeeshoConnector {
  constructor() {
    this.config = MARKETPLACE_REGISTRY.meesho;
  }

  /**
   * Search Meesho catalog for electronic gadgets
   */
  async searchProducts(query) {
    const cleanQuery = encodeURIComponent(query.trim());
    const searchUrl = `https://www.meesho.com/search?q=${cleanQuery}`;

    return {
      providerId: this.config.providerId,
      providerName: this.config.displayName,
      searchUrl,
      items: [
        {
          sourceItemId: `meesho-${cleanQuery.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          providerId: "meesho",
          marketplaceName: "Meesho",
          productUrl: searchUrl,
          isExactMatch: false,
          isSearchFallback: true,
          badge: "Meesho Direct",
          currency: "INR",
          availability: "Available on Meesho",
          observedAt: new Date().toISOString(),
          reviewFetchStatus: {
            available: false,
            reason: "Meesho currently does not offer an authorized third-party customer review API."
          }
        }
      ]
    };
  }

  /**
   * Build safe verified outbound URL for Meesho
   */
  getOutboundUrl(product) {
    if (product.offers?.meesho?.productUrl) {
      return product.offers.meesho.productUrl;
    }
    const q = encodeURIComponent(`${product.brand} ${product.name}`);
    return `https://www.meesho.com/search?q=${q}`;
  }
}

export const meeshoConnector = new MeeshoConnector();
