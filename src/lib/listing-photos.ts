import type { Listing } from "@/types/listing";

export interface ListingPhoto {
  id: number;
  gradient: string;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getListingPhotos(listing: Listing): ListingPhoto[] {
  const base = hashString(listing.id + listing.city);
  const hues = [200, 210, 195, 220, 185];

  return [0, 1, 2, 3, 4].map((i) => {
    const hue = hues[(base + i) % hues.length];
    const lightness = 48 + (i % 3) * 6;
    return {
      id: i,
      gradient: `linear-gradient(135deg, hsl(${hue}, 82%, ${lightness}%), hsl(${hue + 25}, 75%, ${lightness + 12}%))`,
    };
  });
}

export function getAmenities(listing: Listing): string[] {
  const common = ["WiFi", "Self check-in", "Smoke alarm"];

  if (listing.listing_type === "homes" || listing.category === "homes" || listing.category === "stays") {
    return [
      "Kitchen",
      "Free parking",
      "Washer",
      "Air conditioning",
      "Dedicated workspace",
      "TV",
      ...common,
    ];
  }

  if (listing.listing_type === "experiences") {
    return ["Expert host", "Small group", "All equipment included", "Great for beginners", ...common];
  }

  return ["Licensed provider", "Flexible scheduling", "Satisfaction guaranteed", ...common];
}
