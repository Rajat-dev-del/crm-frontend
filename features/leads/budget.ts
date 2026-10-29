const UNIT_MULTIPLIERS: [RegExp, number][] = [
  [/^(crores?|cr)$/, 10_000_000],
  [/^(lakhs?|lacs?|l)$/, 100_000],
  [/^(thousand|k)$/, 1_000],
];

/** Parses one amount such as "50 lakh", "1.2Cr", "₹45,00,000" or "75k" into rupees. */
function parseAmount(text: string): number | null {
  const match = text.replace(/[₹,\s]|rs\.?|inr/gi, (token) => (token.trim() === "" ? " " : "")).trim()
    .match(/^(\d+(?:\.\d+)?)\s*([a-z]*)$/i);
  if (!match) return null;
  const value = Number.parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  if (!unit) return value;
  const multiplier = UNIT_MULTIPLIERS.find(([pattern]) => pattern.test(unit))?.[1];
  return multiplier ? value * multiplier : null;
}

/**
 * Turns a free-text budget into rupees. Ranges ("50 lakh – 1 crore") use their midpoint, and a
 * unit written only on the upper end ("50–80 lakh") applies to both. Returns null when unreadable.
 */
export function parseBudget(budget: string | null): number | null {
  if (!budget?.trim()) return null;
  const parts = budget.toLowerCase().split(/\s*(?:-|–|—|to)\s*/).filter(Boolean);
  if (parts.length === 1) return parseAmount(parts[0]);
  if (parts.length !== 2) return null;

  const [lowText, highText] = parts;
  const high = parseAmount(highText);
  let low = parseAmount(lowText);
  const highUnit = highText.match(/[a-z]+$/)?.[0];
  if (low !== null && /^[\d.,\s₹]+$/.test(lowText) && highUnit) low = parseAmount(`${lowText} ${highUnit}`);
  if (low === null || high === null) return null;
  return (low + high) / 2;
}
