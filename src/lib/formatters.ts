/**
 * Converts ENUM_STYLE_STRING → "Enum Style String"
 * e.g. "UNDER_REVIEW" → "Under Review"
 *      "DROPPED_OUT" → "Dropped Out"
 */
export function formatEnumLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Formats a number as currency
 * e.g. 150000 → "৳1,50,000" (BDT) or "$150,000" (USD)
 */
export function formatCurrency(
  amount: number,
  currency: string = "BDT"
): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a large number with abbreviations
 * e.g. 1240 → "1,240", 15000 → "15K"
 */
export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 10_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}