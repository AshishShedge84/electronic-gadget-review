/**
 * Currency and Number Formatting Utilities for Reviewly AI
 * Mandatory: All pricing and financial metrics must use Indian Rupees (₹ / INR)
 * with proper Indian digit grouping (e.g. ₹1,29,999, ₹24,990).
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrCompactFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const inrNumberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

/**
 * Format numeric amount into INR currency string (e.g., ₹1,49,900)
 * @param {number|string} amount
 * @param {boolean} compact - whether to format as compact (e.g. ₹1.5L)
 * @returns {string}
 */
export function formatINR(amount, compact = false) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0';
  }
  const numericValue = typeof amount === 'number' ? amount : parseFloat(amount);
  if (compact && numericValue >= 100000) {
    return inrCompactFormatter.format(numericValue);
  }
  return inrFormatter.format(numericValue);
}

/**
 * Format generic Indian number with comma grouping (e.g. 14,820)
 * @param {number|string} count
 * @returns {string}
 */
export function formatNumberIN(count) {
  if (count === null || count === undefined || isNaN(Number(count))) {
    return '0';
  }
  return inrNumberFormatter.format(Number(count));
}
