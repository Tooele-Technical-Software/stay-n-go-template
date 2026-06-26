import { describe, expect, it } from "vitest";
import {
  applyFilters,
  categoryLabel,
  defaultFilters,
  getListingType,
} from "./categories";
import type { Listing } from "@/types/listing";

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    host_id: "host-1",
    title: "Cozy place",
    description: "A nice spot for guests to stay and relax.",
    city: "Austin",
    country: "USA",
    address: "123 Main St",
    address_line_2: null,
    zip_code: "78701",
    home_type: "apartment",
    price_per_night: "150",
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    category: "homes",
    listing_type: "homes",
    is_active: true,
    created_at: "2026-01-01",
    ...overrides,
  };
}

describe("getListingType", () => {
  it("prefers listing_type when present", () => {
    expect(getListingType(makeListing({ listing_type: "services", category: "chef" }))).toBe(
      "services"
    );
  });

  it("maps legacy stays category to homes", () => {
    expect(getListingType(makeListing({ listing_type: undefined, category: "stays" }))).toBe(
      "homes"
    );
  });

  it("maps experience categories correctly", () => {
    expect(getListingType(makeListing({ listing_type: undefined, category: "food_tour" }))).toBe(
      "experiences"
    );
  });
});

describe("categoryLabel", () => {
  it("returns friendly labels for known categories", () => {
    expect(categoryLabel("chef")).toBe("Private chef");
    expect(categoryLabel("stays")).toBe("Home");
  });
});

describe("applyFilters", () => {
  it("filters by tab, city, and minimum price", () => {
    const listings = [
      makeListing({ id: "1", city: "Austin", price_per_night: "100" }),
      makeListing({ id: "2", city: "Austin", price_per_night: "200" }),
      makeListing({
        id: "3",
        city: "Austin",
        price_per_night: "300",
        listing_type: "services",
        category: "chef",
      }),
    ];

    const filtered = applyFilters(
      listings,
      "homes",
      { ...defaultFilters, cities: ["Austin"], minPrice: 120 }
    );

    expect(filtered.map((listing) => listing.id)).toEqual(["2"]);
  });
});
