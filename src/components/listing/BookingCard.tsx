"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { getListingType } from "@/lib/categories";
import { formatPrice, nightsBetween } from "@/lib/dates";
import type { Listing } from "@/types/listing";

const fieldClassName =
  "mt-0.5 w-full bg-transparent text-sm text-[var(--foreground)] outline-none";

export default function BookingCard({ listing }: { listing: Listing }) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingType = getListingType(listing);
  const isHome = listingType === "homes";

  const [checkIn, setCheckIn] = useState(searchParams.get("check_in") ?? "");
  const [checkOut, setCheckOut] = useState(searchParams.get("check_out") ?? "");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");

  const price = parseFloat(listing.price_per_night);
  const nights =
    checkIn && checkOut && checkOut > checkIn
      ? nightsBetween(checkIn, checkOut)
      : 0;
  const subtotal = nights > 0 ? price * nights : 0;
  const serviceFee = nights > 0 ? Math.round(subtotal * 0.12) : 0;
  const total = subtotal + serviceFee;

  function handleReserve(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    const params = new URLSearchParams({
      check_in: checkIn,
      check_out: checkOut,
      guests: String(guests),
    });
    router.push(`/listings/${listing.id}/checkout?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl border border-primary/15 bg-card p-6 shadow-lg shadow-primary/5">
      <div className="mb-5 flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-foreground">
          {formatPrice(listing.price_per_night)}
        </span>
        <span className="text-muted">
          {isHome ? "night" : "person"}
        </span>
      </div>

      <form onSubmit={handleReserve} className="space-y-0">
        <div className="overflow-hidden rounded-xl border border-input-border">
          <div className="grid grid-cols-2 border-b border-input-border">
            <div className="border-r border-input-border p-3">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-foreground">
                {isHome ? "Check-in" : "Start"} *
              </label>
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={fieldClassName}
              />
            </div>
            <div className="p-3">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-foreground">
                {isHome ? "Check-out" : "End"} *
              </label>
              <input
                type="date"
                required
                value={checkOut}
                min={checkIn || undefined}
                onChange={(e) => setCheckOut(e.target.value)}
                className={fieldClassName}
              />
            </div>
          </div>
          <div className="p-3">
            <label className="block text-[10px] font-bold uppercase tracking-wide text-foreground">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className={fieldClassName}
            >
              {Array.from({ length: listing.max_guests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} guest{n !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {user ? (
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-primary py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Reserve
          </button>
        ) : (
          <Link
            href="/login"
            className="mt-4 block w-full rounded-lg bg-primary py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Log in to reserve
          </Link>
        )}

        <p className="mt-3 text-center text-sm text-muted">
          You won&apos;t be charged until the next step
        </p>

        {nights > 0 && (
          <div className="mt-6 space-y-3 border-t border-primary/15 pt-5 text-sm">
            <div className="flex justify-between text-muted">
              <span>
                {formatPrice(price)} × {nights} night{nights !== 1 ? "s" : ""}
              </span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Stay N Go service fee</span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
            <div className="flex justify-between border-t border-primary/15 pt-3 font-semibold text-foreground">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
