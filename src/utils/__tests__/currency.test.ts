import { formatPriceInr } from "../currency";

describe("formatPriceInr", () => {
  it("formats numbers as INR currency", () => {
    const formatted = formatPriceInr(154999);

    expect(formatted).toContain("₹");
    expect(formatted).toContain("1,54,999");
  });
});
