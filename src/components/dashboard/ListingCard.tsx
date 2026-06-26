"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { fetchWithToken } from "@/lib/api-helpers";
import type { Listing } from "@/types/listing";
import { categoryLabel, getListingType } from "@/lib/categories";
import { formatPrice } from "@/lib/dates";

function placeholderGradient(city: string): string {
  const hues = [200, 210, 195, 220, 185];
  const hue = hues[city.charCodeAt(0) % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 82%, 50%), hsl(${hue + 25}, 75%, 62%))`;
}

const typeBadge: Record<string, string> = {
  homes: "bg-primary/10 text-primary",
  services: "bg-vivid/10 text-vivid",
  experiences: "bg-primary-light/20 text-primary-dark",
};

export default function ListingCard({
  listing,
  onListingUpdate,
}: {
  listing: Listing;
  onListingUpdate?: (listing: Listing) => void;
}) {
  const { token } = useAuth();
  const [status, setStatus] = useState(listing.is_active);
  const [toggling, setToggling] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    setStatus(listing.is_active);
  }, [listing.is_active]);

  const listingType = getListingType(listing);
  const category = listing.category === "stays" ? "homes" : listing.category;
  const isHome = listingType === "homes";

  async function toggleStatus() {
    if (!token || toggling) return;
    setStatusError("");
    setToggling(true);

    const nextActive = !status;

    try {
      const data = await fetchWithToken<{ listing: Listing }>(
        "/listings/" + listing.id + "/status",
        token,
        {
          method: "PATCH",
          body: JSON.stringify({ is_active: nextActive }),
        }
      );
      setStatus(data.listing.is_active);
      onListingUpdate?.(data.listing);
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : "Could not update listing status."
      );
    } finally {
      setToggling(false);
    }
  }

  const cardHref = status
    ? `/listings/${listing.id}`
    : isHome
      ? `/host/${listing.id}`
      : null;

  const cardBody = (
    <>
      <div className="relative">
          <div
            className="h-40 w-full"
            style={{ background: placeholderGradient(listing.city) }}
          />
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${typeBadge[listingType]}`}
          >
            {listingType.slice(0, -1)}
          </span>
          {!status && (
            <span className="absolute right-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-muted shadow-sm">
              Draft
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-foreground">{listing.title}</h3>
          <p className="text-sm text-muted">
            {listing.city}, {listing.country} · {categoryLabel(category)}
          </p>
          {isHome ? (
            <p className="mt-2 text-sm text-muted">
              {listing.bedrooms} bed · {listing.bathrooms} bath · {listing.max_guests}{" "}
              guests
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted">
              Up to {listing.max_guests} guest{listing.max_guests !== 1 ? "s" : ""}
            </p>
          )}
          <p className="mt-2 font-semibold text-foreground">
            {formatPrice(listing.price_per_night)}
            <span className="font-normal text-muted">
              {isHome ? " / night" : " / person"}
            </span>
          </p>
        </div>
    </>
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm transition-shadow hover:shadow-md">
      {cardHref ? (
        <Link href={cardHref} className="block">
          {cardBody}
        </Link>
      ) : (
        <div className="block">{cardBody}</div>
      )}
      <div className="space-y-2 border-t border-primary/10 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              status
                ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                : "bg-accent text-muted"
            }`}
          >
            {status ? "Active" : "Draft"}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleStatus}
              disabled={toggling}
              className="rounded-full border-2 border-primary px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
            >
              {toggling
                ? "Saving..."
                : status
                  ? "Move to draft"
                  : "Set active"}
            </button>
            {isHome && (
              <Link
                href={`/host/${listing.id}`}
                className="rounded-full border-2 border-primary/30 px-3 py-1.5 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary hover:text-primary"
              >
                Edit
              </Link>
            )}
          </div>
        </div>
        {statusError && (
          <p className="text-xs text-red-600 dark:text-red-400">{statusError}</p>
        )}
        <p className="text-xs text-muted">
          {status
            ? "Visible on Explore and open for bookings."
            : "Hidden from Explore while in draft."}
        </p>
      </div>
    </article>
  );
}
