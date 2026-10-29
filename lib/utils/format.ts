const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
const timeFormatter = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

/** 27/10/2026 */
export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

/** 06:08 pm */
export function formatTime(value: string | Date) {
  return timeFormatter.format(new Date(value));
}

const rupeeFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/** Short Indian-style rupee amount: ₹44.93Cr, ₹12.5L, ₹75,000. */
export function formatRupeesCompact(amount: number) {
  const trim = (value: number) => Number(value.toFixed(2)).toString();
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  if (abs >= 10_000_000) return `${sign}₹${trim(abs / 10_000_000)}Cr`;
  if (abs >= 100_000) return `${sign}₹${trim(abs / 100_000)}L`;
  return rupeeFormatter.format(amount);
}

/** "Asha Rao" -> "AR"; one letter for single names. */
export function initials(name: string, max = 2) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Local start of a yyyy-mm-dd date input as an ISO timestamp. */
export function startOfDayIso(date: string) {
  return new Date(`${date}T00:00:00`).toISOString();
}

/** Local end of a yyyy-mm-dd date input as an ISO timestamp. */
export function endOfDayIso(date: string) {
  return new Date(`${date}T23:59:59.999`).toISOString();
}
