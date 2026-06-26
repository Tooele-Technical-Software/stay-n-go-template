import { describe, expect, it } from "vitest";
import { calculateBookingTotal, formatBookingSummary } from "./booking";

describe("calculateBookingTotal", () => {
  it("calculates nights, subtotal, 12% service fee, and total", () => {
    const result = calculateBookingTotal(100, "2026-07-01", "2026-07-05");

    expect(result.nights).toBe(4);
    expect(result.subtotal).toBe(400);
    expect(result.serviceFee).toBe(48);
    expect(result.total).toBe(448);
  });

  it("accepts string price values from the API", () => {
    const result = calculateBookingTotal("120", "2026-08-01", "2026-08-03");

    expect(result.nights).toBe(2);
    expect(result.subtotal).toBe(240);
    expect(result.serviceFee).toBe(29);
    expect(result.total).toBe(269);
  });
});

describe("formatBookingSummary", () => {
  it("uses night wording for homes", () => {
    expect(formatBookingSummary("homes", 1)).toBe("1 night");
    expect(formatBookingSummary("homes", 3)).toBe("3 nights");
  });

  it("uses day wording for services and experiences", () => {
    expect(formatBookingSummary("services", 1)).toBe("1 day");
    expect(formatBookingSummary("experiences", 2)).toBe("2 days");
  });
});
