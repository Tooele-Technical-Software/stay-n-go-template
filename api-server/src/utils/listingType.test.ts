import { describe, expect, it } from "vitest";
import { deriveListingType, enrichListing } from "./listingType.js";

describe("deriveListingType", () => {
  it("maps homes and stays to homes", () => {
    expect(deriveListingType("homes")).toBe("homes");
    expect(deriveListingType("stays")).toBe("homes");
  });

  it("maps service and experience categories", () => {
    expect(deriveListingType("chef")).toBe("services");
    expect(deriveListingType("food_tour")).toBe("experiences");
  });
});

describe("enrichListing", () => {
  it("fills listing_type from category when missing", () => {
    const row = { category: "spa", title: "Massage" };
    expect(enrichListing(row).listing_type).toBe("services");
  });

  it("keeps an existing listing_type", () => {
    const row = { category: "chef", listing_type: "experiences" as const, title: "Tour" };
    expect(enrichListing(row).listing_type).toBe("experiences");
  });
});
