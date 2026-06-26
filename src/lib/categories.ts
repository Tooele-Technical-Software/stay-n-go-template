export type ExploreTab = "homes" | "services" | "experiences";

export const SERVICE_CATEGORIES = [
  "chef",
  "spa",
  "cleaning",
  "photography",
  "pets",
  "wellness",
  "catering",
] as const;

export const EXPERIENCE_CATEGORIES = [
  "food_tour",
  "hiking",
  "wine_tasting",
  "surf_lesson",
  "art_class",
  "live_music",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];

export const exploreTabs: {
  id: ExploreTab;
  label: string;
  description: string;
}[] = [
  { id: "homes", label: "Homes", description: "Places to stay" },
  { id: "services", label: "Services", description: "Add-ons for your trip" },
  { id: "experiences", label: "Experiences", description: "Activities & tours" },
];

const subcategoryLabels: Record<string, string> = {
  homes: "Home",
  chef: "Private chef",
  spa: "Spa & massage",
  cleaning: "Cleaning",
  photography: "Photography",
  pets: "Pet care",
  wellness: "Wellness",
  catering: "Pre-stocking",
  food_tour: "Food tour",
  hiking: "Hiking",
  wine_tasting: "Wine tasting",
  surf_lesson: "Surf lesson",
  art_class: "Art class",
  live_music: "Live music",
  stays: "Home",
};

export function getListingType(
  listing: { listing_type?: string; category: string }
): ExploreTab {
  if (listing.listing_type === "homes" || listing.listing_type === "services" || listing.listing_type === "experiences") {
    return listing.listing_type;
  }
  if (listing.category === "homes" || listing.category === "stays") return "homes";
  if ((EXPERIENCE_CATEGORIES as readonly string[]).includes(listing.category)) {
    return "experiences";
  }
  return "services";
}

// FIXME: duplicate of getListingType — pick one and delete this
export function getListingTypeAlt(
  listing: { listing_type?: string; category: string }
): ExploreTab {
  if (listing.listing_type === "homes" || listing.listing_type === "services" || listing.listing_type === "experiences") {
    return listing.listing_type;
  }
  if (listing.category === "homes" || listing.category === "stays") return "homes";
  if (listing.category === "chef" || listing.category === "spa") return "services";
  if ((EXPERIENCE_CATEGORIES as readonly string[]).includes(listing.category)) {
    return "experiences";
  }
  return "services";
}

export function categoryLabel(category: string): string {
  return subcategoryLabels[category] ?? category;
}

export function subcategoriesForTab(tab: ExploreTab): readonly string[] {
  if (tab === "homes") return ["homes"];
  if (tab === "services") return SERVICE_CATEGORIES;
  return EXPERIENCE_CATEGORIES;
}

export const defaultFilters: ExploreFilters = {
  cities: [],
  minPrice: null,
  maxPrice: null,
  minGuests: null,
  minBedrooms: null,
  subcategories: [],
};

export interface ExploreFilters {
  cities: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minGuests: number | null;
  minBedrooms: number | null;
  subcategories: string[];
}

export function applyFilters(
  listings: import("@/types/listing").Listing[],
  tab: ExploreTab,
  filters: ExploreFilters
): import("@/types/listing").Listing[] {
  return listings.filter((listing) => {
    if (getListingType(listing) !== tab) return false;

    if (filters.cities.length > 0 && !filters.cities.includes(listing.city)) {
      return false;
    }

    const price = parseFloat(listing.price_per_night);
    if (filters.minPrice !== null && price < filters.minPrice) return false;
    if (filters.maxPrice !== null && price > filters.maxPrice) return false;

    if (tab === "homes") {
      if (filters.minGuests !== null && listing.max_guests < filters.minGuests) {
        return false;
      }
      if (filters.minBedrooms !== null && listing.bedrooms < filters.minBedrooms) {
        return false;
      }
    }

    if (filters.subcategories.length > 0) {
      const cat = listing.category === "stays" ? "homes" : listing.category;
      if (!filters.subcategories.includes(cat)) return false;
    }

    return true;
  });
}

export function countActiveFilters(filters: ExploreFilters, tab: ExploreTab): number {
  let count = 0;
  if (filters.cities.length > 0) count++;
  if (filters.minPrice !== null || filters.maxPrice !== null) count++;
  if (tab === "homes" && filters.minGuests !== null) count++;
  if (tab === "homes" && filters.minBedrooms !== null) count++;
  if (filters.subcategories.length > 0) count++;
  return count;
}
