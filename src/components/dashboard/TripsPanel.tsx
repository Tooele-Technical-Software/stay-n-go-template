import Link from "next/link";
import type { Booking } from "@/types/booking";
import { categorizeBooking } from "@/lib/dates";
import TripCard from "./TripCard";
import EmptyState from "./EmptyState";

export default function TripsPanel({ bookings }: { bookings: Booking[] }) {
  const active = bookings.filter((b) => b.status !== "cancelled");
  const upcoming = active.filter((b) => categorizeBooking(b) === "upcoming");
  const past = active.filter((b) => categorizeBooking(b) === "past");

  if (active.length === 0) {
    return (
      <EmptyState
        title="No trips booked yet"
        description="When you book a stay, it'll show up here. Time to dust off your bags!"
        actionLabel="Explore stays"
        actionHref="/explore"
      />
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Upcoming trips
          {upcoming.length > 0 && (
            <span className="ml-2 text-base font-normal text-muted">
              ({upcoming.length})
            </span>
          )}
        </h2>
        {upcoming.length === 0 ? (
          <p className="rounded-xl bg-card px-5 py-8 text-center text-sm text-muted">
            No upcoming trips.{" "}
            <Link href="/explore" className="font-medium text-primary hover:underline">
              Find your next stay
            </Link>
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {upcoming.map((booking) => (
              <TripCard key={booking.id} booking={booking} variant="upcoming" />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Places you&apos;ve stayed
          {past.length > 0 && (
            <span className="ml-2 text-base font-normal text-muted">
              ({past.length})
            </span>
          )}
        </h2>
        {past.length === 0 ? (
          <p className="rounded-xl bg-card px-5 py-8 text-center text-sm text-muted">
            Your past trips will appear here after you&apos;ve checked out.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {past.map((booking) => (
              <TripCard key={booking.id} booking={booking} variant="past" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
