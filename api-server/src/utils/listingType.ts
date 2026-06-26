const EXPERIENCE_CATEGORIES = new Set([
  "food_tour",
  "hiking",
  "wine_tasting",
  "surf_lesson",
  "art_class",
  "live_music",
]);

const SERVICE_CATEGORIES = new Set([
  "chef",
  "spa",
  "cleaning",
  "photography",
  "pets",
  "wellness",
  "catering",
]);

export function deriveListingType(category: string): "homes" | "services" | "experiences" {
  if (category === "homes" || category === "stays") return "homes";
  if (EXPERIENCE_CATEGORIES.has(category)) return "experiences";
  if (SERVICE_CATEGORIES.has(category)) return "services";
  return "homes";
}

export function enrichListing<T extends { category: string; listing_type?: string }>(
  row: T
): T & { listing_type: "homes" | "services" | "experiences" } {
  return {
    ...row,
    listing_type: (row.listing_type as "homes" | "services" | "experiences") ??
      deriveListingType(row.category),
  };
}
