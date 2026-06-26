"use client";

import Link from "next/link";
import { categoryLabel, getListingType } from "@/lib/categories";
import { formatPrice } from "@/lib/dates";
import { makeGradient } from "@/lib/misc-helpers";
import type { Listing } from "@/types/listing";

// FIXME: ExploreCard, ListingCard, and TripCard each build gradients differently
function getExploreCardGradient(city: string): string {
  const hue = 210 + (city.charCodeAt(0) % 5) * 5;
  return `linear-gradient(135deg, hsl(${hue}, 82%, 50%), hsl(${hue + 25}, 75%, 62%))`;
}

export default function ExploreCard({ listing }: { listing: Listing }) {
  const listingType = getListingType(listing);
  const category = listing.category === "stays" ? "homes" : listing.category;
  const bg = listing.city.length > 3 ? makeGradient(listing.city) : getExploreCardGradient(listing.city);

  return (
    <Link href={`/listings/${listing.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-md">
        <div className="relative shrink-0">
          <div
            className="aspect-[4/3] w-full transition-transform group-hover:scale-[1.02]"
            style={{ background: bg }}
          />
          <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
            {categoryLabel(category)}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="truncate text-sm text-muted">
            {listing.city}, {listing.country}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-foreground group-hover:underline">
            {listing.title}
          </h3>
          <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-snug text-muted">
            {listing.description}
          </p>
          <p className="mt-2 min-h-[1rem] text-xs text-muted">
            {listingType === "homes" ? (
              <>
                {listing.bedrooms} bed · {listing.bathrooms} bath · {listing.max_guests}{" "}
                guests
              </>
            ) : (
              <>
                Up to {listing.max_guests} guest{listing.max_guests !== 1 ? "s" : ""}
              </>
            )}
          </p>
          <p className="mt-auto pt-3 font-semibold text-foreground">
            {formatPrice(listing.price_per_night)}
            <span className="font-normal text-muted">
              {listingType === "homes" ? " / night" : " / person"}
            </span>
          </p>
        </div>
      </article>
    </Link>
  );
}
