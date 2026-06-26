import type { Listing } from "@/types/listing";

export function formatListingAddress(listing: Pick<
  Listing,
  "address" | "address_line_2" | "city" | "country" | "zip_code"
>): string[] {
  const lines: string[] = [];

  if (listing.address) {
    lines.push(listing.address);
  }
  if (listing.address_line_2?.trim()) {
    lines.push(listing.address_line_2.trim());
  }

  const cityLine = [listing.city, listing.zip_code, listing.country]
    .filter(Boolean)
    .join(", ");

  if (cityLine) {
    lines.push(cityLine);
  }

  return lines;
}
