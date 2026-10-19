/**
 * Product Identity Normalizer and Deduplicator
 * Normalizes multi-source titles into canonical product keys.
 * Crucially preserves distinct storage/RAM variants, screen sizes, and generations without false merging.
 */

/**
 * Extract distinct variant signature (storage, RAM, generation) from title
 */
export function extractVariantSignature(title = "") {
  const t = title.toLowerCase();

  // Storage patterns (e.g. 128gb, 256gb, 512gb, 1tb)
  const storageMatch = t.match(/\b(64|128|256|512)\s*gb\b|\b(1|2)\s*tb\b/i);
  const storage = storageMatch ? storageMatch[0].replace(/\s+/g, "").toUpperCase() : null;

  // RAM patterns (e.g. 8gb ram, 16gb, 18gb, 24gb, 36gb)
  const ramMatch = t.match(/\b(8|12|16|18|24|32|36|64)\s*gb\s*(?:unified|ram|memory)?\b/i);
  const ram = ramMatch ? ramMatch[0].replace(/\s+/g, "").toUpperCase() : null;

  // Generation / Chip / Model patterns (e.g. M3, M3 Pro, M4, S24, 16 Pro Max, XM5)
  const chipMatch = t.match(/\b(m[1-4](?:\s*pro|\s*max)?|snapdragon\s*8\s*gen\s*[1-3]|a1[7-8]\s*pro)\b/i);
  const chip = chipMatch ? chipMatch[0].replace(/\s+/g, " ").toUpperCase() : null;

  // Screen size (e.g. 14-inch, 14", 16-inch, 13", 11", 49mm, 45mm)
  const sizeMatch = t.match(/\b(\d{1,2}(?:\.\d)?)\s*(?:inch|\"|mm)\b/i);
  const size = sizeMatch ? sizeMatch[0].replace(/\s+/g, "").toLowerCase() : null;

  return { storage, ram, chip, size };
}

/**
 * Determine if two product records represent the exact same hardware variant
 */
export function areExactHardwareVariants(prodA, prodB) {
  if (!prodA || !prodB) return false;

  // If brands exist and differ, definitely not the same product
  if (prodA.brand && prodB.brand && prodA.brand.toLowerCase() !== prodB.brand.toLowerCase()) {
    return false;
  }

  const sigA = extractVariantSignature(prodA.name);
  const sigB = extractVariantSignature(prodB.name);

  // If both have storage specified and they differ, DO NOT MERGE
  if (sigA.storage && sigB.storage && sigA.storage !== sigB.storage) {
    return false;
  }

  // If both have RAM specified and they differ, DO NOT MERGE
  if (sigA.ram && sigB.ram && sigA.ram !== sigB.ram) {
    return false;
  }

  // If both have chip specified and they differ, DO NOT MERGE
  if (sigA.chip && sigB.chip && sigA.chip !== sigB.chip) {
    return false;
  }

  // If both have size specified and they differ, DO NOT MERGE
  if (sigA.size && sigB.size && sigA.size !== sigB.size) {
    return false;
  }

  return true;
}

/**
 * Deduplicate and consolidate search results across marketplace connectors
 */
export function deduplicateAndConsolidateProducts(rawProducts = []) {
  const consolidated = [];

  for (const item of rawProducts) {
    // Check if item matches an existing consolidated product
    const existingIndex = consolidated.findIndex((cand) => areExactHardwareVariants(cand, item));

    if (existingIndex >= 0) {
      // Merge offers while preserving the most complete specifications
      const current = consolidated[existingIndex];
      const mergedOffers = {
        ...(current.offers || {}),
        ...(item.offers || {})
      };

      consolidated[existingIndex] = {
        ...current,
        offers: mergedOffers,
        image: current.image || item.image,
        specs: { ...(item.specs || {}), ...(current.specs || {}) },
        // Keep highest confidence score
        matchConfidence: Math.max(current.matchConfidence || 0.8, item.matchConfidence || 0.8)
      };
    } else {
      consolidated.push({
        ...item,
        matchConfidence: item.matchConfidence || 0.85
      });
    }
  }

  return consolidated.sort((a, b) => (b.matchConfidence || 0) - (a.matchConfidence || 0));
}
