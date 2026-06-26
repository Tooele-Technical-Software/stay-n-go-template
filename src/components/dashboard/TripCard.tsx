import type { Booking } from "@/types/booking";
import {
  formatDateRange,
  formatPrice,
  nightsBetween,
} from "@/lib/dates";

function placeholderGradient(city: string): string {
  const hues = [210, 220, 200, 230, 195];
  const hue = hues[city.charCodeAt(0) % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 70%, 45%), hsl(${hue + 20}, 60%, 65%))`;
}

export default function TripCard({
  booking,
  variant,
}: {
  booking: Booking;
  variant: "upcoming" | "past";
}) {
  const nights = nightsBetween(booking.check_in, booking.check_out);

  return (
    <article className="overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div
        className="h-40 w-full"
        style={{ background: placeholderGradient(booking.city) }}
      />
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-foreground">{booking.listing_title}</h3>
            <p className="text-sm text-muted">
              {booking.city}, {booking.country}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
              variant === "upcoming"
                ? "bg-blue-50 text-primary dark:bg-primary/20"
                : "bg-accent text-muted"
            }`}
          >
            {variant === "upcoming" ? booking.status : "Completed"}
          </span>
        </div>
        <p className="text-sm text-muted">
          {formatDateRange(booking.check_in, booking.check_out)}
        </p>
        <p className="mt-1 text-sm text-muted">
          {nights} night{nights !== 1 ? "s" : ""} ·{" "}
          {formatPrice(booking.total_price)} total
        </p>
      </div>
    </article>
  );
}
