export function getPropertyPrice(property) {
  const raw = property?.priceRangeMin ?? property?.totalPrice ?? property?.monthlyRent ?? property?.price;
  const cleaned = typeof raw === "string" ? raw.replace(/,/g, "") : raw;
  let value = typeof cleaned === "string"
    ? Number(cleaned.replace(/[^0-9.-]/g, ""))
    : Number(cleaned);
  if (typeof cleaned === "string" && /\b(cr|crore)s?\b/i.test(cleaned)) value *= 10000000;
  if (typeof cleaned === "string" && /\b(lac|lakh)s?\b/i.test(cleaned)) value *= 100000;
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function formatPropertyPrice(property, { prefix = "₹ " } = {}) {
  const value = getPropertyPrice(property);
  if (!value) return "Price on request";
  if (value >= 10000000) return `${prefix}${(value / 10000000).toFixed(2)} Cr`;
  return `${prefix}${(value / 100000).toFixed(value < 100000 ? 2 : 0)} Lakhs`;
}
