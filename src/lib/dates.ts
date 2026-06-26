import type { Booking } from "@/types/booking";

export type TripCategory = "upcoming" | "past";

function toDateOnly(iso: string): Date {
  const datePart = iso.split("T")[0];
  return new Date(`${datePart}T12:00:00`);
}

function today(): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
}

export function categorizeBooking(booking: Booking): TripCategory {
  const checkOut = toDateOnly(booking.check_out);
  return checkOut < today() ? "past" : "upcoming";
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  const start = toDateOnly(checkIn);
  const end = toDateOnly(checkOut);
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = toDateOnly(checkIn);
  const end = toDateOnly(checkOut);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatPrice(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
