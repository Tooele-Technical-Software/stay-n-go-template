import { afterEach, describe, expect, it, vi } from "vitest";
import type { Booking } from "@/types/booking";
import {
  categorizeBooking,
  formatDateRange,
  formatPrice,
  nightsBetween,
} from "./dates";

describe("nightsBetween", () => {
  it("returns the number of nights between two dates", () => {
    expect(nightsBetween("2026-07-01", "2026-07-05")).toBe(4);
    expect(nightsBetween("2026-07-01", "2026-07-02")).toBe(1);
  });
});

describe("formatPrice", () => {
  it("formats numbers and numeric strings as USD without cents", () => {
    expect(formatPrice(120)).toBe("$120");
    expect(formatPrice("250")).toBe("$250");
  });
});

describe("formatDateRange", () => {
  it("formats a check-in and check-out range", () => {
    const range = formatDateRange("2026-07-01", "2026-07-05");
    expect(range).toContain("2026");
    expect(range).toContain("–");
  });
});

describe("categorizeBooking", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function makeBooking(checkOut: string): Booking {
    return {
      id: "1",
      listing_id: "1",
      guest_id: "1",
      check_in: "2026-01-01",
      check_out: checkOut,
      total_price: "100",
      status: "confirmed",
      created_at: "2026-01-01",
      listing_title: "Test",
      city: "Austin",
      country: "USA",
      guest_name: "Jane",
    };
  }

  it("marks past trips when check-out is before today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-01T12:00:00"));

    expect(categorizeBooking(makeBooking("2026-06-01"))).toBe("past");
  });

  it("marks upcoming trips when check-out is today or later", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-01T12:00:00"));

    expect(categorizeBooking(makeBooking("2026-07-01"))).toBe("upcoming");
    expect(categorizeBooking(makeBooking("2026-08-01"))).toBe("upcoming");
  });
});
