import type { ExploreTab } from "./categories";
import { formatPrice } from "./dates";
import { nightsBetween } from "./dates";

export function calculateBookingTotal(
  pricePerNight: string | number,
  checkIn: string,
  checkOut: string
): {
  nights: number;
  subtotal: number;
  serviceFee: number;
  total: number;
} {
  const price =
    typeof pricePerNight === "string" ? parseFloat(pricePerNight) : pricePerNight;
  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = price * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;
  return { nights, subtotal, serviceFee, total };
}

export function formatBookingSummary(
  listingType: ExploreTab,
  nights: number
): string {
  if (listingType === "homes") {
    return `${nights} night${nights !== 1 ? "s" : ""}`;
  }
  return `${nights} day${nights !== 1 ? "s" : ""}`;
}

export { formatPrice };
