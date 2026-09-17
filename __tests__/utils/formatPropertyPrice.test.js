import { formatPropertyPrice, getPropertyPrice } from "@/lib/utils/formatPropertyPrice";

describe("property price formatting", () => {
  test.each([
    [{ totalPrice: 8500000 }, "₹ 85 Lakhs"],
    [{ priceRangeMin: "12,500,000" }, "₹ 1.25 Cr"],
    [{ monthlyRent: "₹ 75,000" }, "₹ 0.75 Lakhs"],
    [{ totalPrice: "1.5 Cr" }, "₹ 1.50 Cr"],
    [{ totalPrice: undefined }, "Price on request"],
    [{ totalPrice: "not available" }, "Price on request"],
  ])("formats %p without NaN", (property, expected) => {
    expect(formatPropertyPrice(property)).toBe(expected);
    expect(formatPropertyPrice(property)).not.toContain("NaN");
  });

  test("uses the first available normalized price field", () => {
    expect(getPropertyPrice({ priceRangeMin: "9,000,000", totalPrice: 10000000 })).toBe(9000000);
  });
});
