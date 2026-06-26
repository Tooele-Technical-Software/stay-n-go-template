import { describe, expect, it } from "vitest";
import { nightsBetween } from "./bookingDates.js";

describe("nightsBetween", () => {
  it("returns whole nights between check-in and check-out", () => {
    expect(nightsBetween("2026-07-01", "2026-07-05")).toBe(4);
    expect(nightsBetween("2026-07-01", "2026-07-02")).toBe(1);
  });
});
