import { describe, expect, it } from "vitest";
import { normalizePriceInput, parseRoomCount } from "./host-form-utils";

describe("parseRoomCount", () => {
  it("parses normal select values", () => {
    expect(parseRoomCount("3", "", 0)).toBe(3);
  });

  it("uses custom value for N+ selections", () => {
    expect(parseRoomCount("8+", "10", 8)).toBe(10);
    expect(parseRoomCount("8+", "bad", 8)).toBe(8);
  });
});

describe("normalizePriceInput", () => {
  it("removes currency symbols and keeps one decimal point", () => {
    expect(normalizePriceInput("$125.50")).toBe("125.50");
    expect(normalizePriceInput("12.3.4")).toBe("12.34");
  });
});
