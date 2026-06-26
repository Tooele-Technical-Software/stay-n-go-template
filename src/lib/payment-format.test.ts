import { describe, expect, it } from "vitest";
import {
  formatCardCvc,
  formatCardExpiry,
  formatCardNumber,
  isCvcValid,
  isDemoCardValid,
  isExpiryValid,
} from "./payment-format";

describe("formatCardNumber", () => {
  it("inserts spaces every four digits", () => {
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
  });

  it("strips non-digits and limits to 16 digits", () => {
    expect(formatCardNumber("4242-4242-4242-4242")).toBe("4242 4242 4242 4242");
    expect(formatCardNumber("42424242424242424242")).toBe("4242 4242 4242 4242");
  });
});

describe("formatCardExpiry", () => {
  it("adds a slash after the month", () => {
    expect(formatCardExpiry("1228")).toBe("12/28");
    expect(formatCardExpiry("12")).toBe("12");
  });
});

describe("formatCardCvc", () => {
  it("keeps digits only and limits length to four", () => {
    expect(formatCardCvc("12a3")).toBe("123");
    expect(formatCardCvc("12345")).toBe("1234");
  });
});

describe("isDemoCardValid", () => {
  it("accepts common test card lengths", () => {
    expect(isDemoCardValid("4242 4242 4242 4242")).toBe(true);
    expect(isDemoCardValid("4242")).toBe(false);
  });
});

describe("isExpiryValid", () => {
  it("validates MM/YY with a real month", () => {
    expect(isExpiryValid("12/28")).toBe(true);
    expect(isExpiryValid("00/28")).toBe(false);
    expect(isExpiryValid("1228")).toBe(false);
  });
});

describe("isCvcValid", () => {
  it("accepts three or four digit codes", () => {
    expect(isCvcValid("123")).toBe(true);
    expect(isCvcValid("1234")).toBe(true);
    expect(isCvcValid("12")).toBe(false);
  });
});
