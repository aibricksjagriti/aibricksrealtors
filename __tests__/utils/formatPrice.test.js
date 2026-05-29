// Tests for the price formatting logic used across property pages

function formatPrice(price) {
  if (!price || isNaN(price)) return "Price on request";
  if (price < 10000000) return ` ${(price / 100000).toFixed(0)} Lakhs`;
  return ` ${(price / 10000000).toFixed(2)} Cr`;
}

function formatPriceRange(min, max) {
  if (!min && !max) return null;
  const fmt = (v) => {
    const n = Number(v);
    if (!n || isNaN(n)) return null;
    if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
    return `${(n / 100000).toFixed(0)} Lac`;
  };
  const lo = fmt(min);
  const hi = fmt(max);
  if (lo && hi) return `₹ ${lo} – ₹ ${hi}`;
  if (lo) return `From ₹ ${lo}`;
  if (hi) return `Up to ₹ ${hi}`;
  return null;
}

function formatAreaDisplay(area) {
  if (Array.isArray(area) && area.length > 0) {
    const values = area.map(e => Number(e.area)).filter(v => !isNaN(v) && v > 0);
    if (values.length === 0) return "—";
    const min = Math.min(...values);
    const max = Math.max(...values);
    return min === max ? `${min} sq.ft` : `${min} – ${max} sq.ft`;
  }
  if (!Array.isArray(area) && area != null && area !== "" && area !== 0) return `${area} sq.ft`;
  return "—";
}

describe("formatPrice", () => {
  test("returns 'Price on request' for null/undefined/0", () => {
    expect(formatPrice(null)).toBe("Price on request");
    expect(formatPrice(undefined)).toBe("Price on request");
    expect(formatPrice(0)).toBe("Price on request");
    expect(formatPrice("abc")).toBe("Price on request");
  });

  test("formats values below 1 Cr as Lakhs", () => {
    expect(formatPrice(5000000)).toBe(" 50 Lakhs");
    expect(formatPrice(2500000)).toBe(" 25 Lakhs");
    expect(formatPrice(9999999)).toBe(" 100 Lakhs");
  });

  test("formats values >= 1 Cr as Crores", () => {
    expect(formatPrice(10000000)).toBe(" 1.00 Cr");
    expect(formatPrice(25000000)).toBe(" 2.50 Cr");
    expect(formatPrice(100000000)).toBe(" 10.00 Cr");
  });
});

describe("formatPriceRange", () => {
  test("returns null when both min and max are empty", () => {
    expect(formatPriceRange(null, null)).toBeNull();
    expect(formatPriceRange("", "")).toBeNull();
    expect(formatPriceRange(0, 0)).toBeNull();
  });

  test("formats a min–max range", () => {
    expect(formatPriceRange(7500000, 30000000)).toBe("₹ 75 Lac – ₹ 3.00 Cr");
  });

  test("formats only min (From)", () => {
    expect(formatPriceRange(5000000, null)).toBe("From ₹ 50 Lac");
  });

  test("formats only max (Up to)", () => {
    expect(formatPriceRange(null, 20000000)).toBe("Up to ₹ 2.00 Cr");
  });

  test("handles Crore–Crore range", () => {
    expect(formatPriceRange(10000000, 50000000)).toBe("₹ 1.00 Cr – ₹ 5.00 Cr");
  });
});

describe("formatAreaDisplay", () => {
  test("returns dash for empty/null/zero area", () => {
    expect(formatAreaDisplay(null)).toBe("—");
    expect(formatAreaDisplay("")).toBe("—");
    expect(formatAreaDisplay(0)).toBe("—");
    expect(formatAreaDisplay([])).toBe("—");
  });

  test("returns single area for non-array value", () => {
    expect(formatAreaDisplay(1200)).toBe("1200 sq.ft");
  });

  test("returns single value when all entries are the same", () => {
    const area = [
      { subType: "2 BHK", area: 1000 },
      { subType: "3 BHK", area: 1000 },
    ];
    expect(formatAreaDisplay(area)).toBe("1000 sq.ft");
  });

  test("returns range when entries differ", () => {
    const area = [
      { subType: "2 BHK", area: 900 },
      { subType: "3 BHK", area: 1400 },
    ];
    expect(formatAreaDisplay(area)).toBe("900 – 1400 sq.ft");
  });

  test("ignores zero-area entries", () => {
    const area = [
      { subType: "2 BHK", area: 0 },
      { subType: "3 BHK", area: 1200 },
    ];
    expect(formatAreaDisplay(area)).toBe("1200 sq.ft");
  });

  test("returns dash when all array entries have zero area", () => {
    const area = [
      { subType: "2 BHK", area: 0 },
      { subType: "3 BHK", area: 0 },
    ];
    expect(formatAreaDisplay(area)).toBe("—");
  });
});
