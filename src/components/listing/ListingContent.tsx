import type { ReactNode } from "react";
import type { Listing } from "@/types/listing";
import { categoryLabel, getListingType } from "@/lib/categories";
import { homeTypeLabel } from "@/lib/home-types";
import { formatListingAddress } from "@/lib/listing-address";
import { getAmenities } from "@/lib/listing-photos";
import { getListingRatings } from "@/lib/listing-reviews";
import ListingReviews from "@/components/listing/ListingReviews";

function Divider() {
  return <hr className="my-8 border-primary/15" />;
}

function Highlight({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground/80">
        {icon}
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

export default function ListingContent({ listing }: { listing: Listing }) {
  const listingType = getListingType(listing);
  const isHome = listingType === "homes";
  const amenities = getAmenities(listing);
  const { overall, count } = getListingRatings(listing);
  const hostInitial = listing.host_name?.charAt(0).toUpperCase() ?? "H";
  const addressLines = isHome ? formatListingAddress(listing) : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          {listing.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.261-.066l.003-.001.004-.002.028-.014a8.3 8.3 0 0 0 .474-.23 12 12 0 0 0 1.157-.752 14.4 14.4 0 0 0 2.305-2.042c1.126-1.19 1.846-2.39 1.846-3.556 0-2.791-2.284-5.055-5.099-5.055-2.815 0-5.099 2.264-5.099 5.055 0 1.166.72 2.366 1.846 3.556A14.4 14.4 0 0 0 10 18.9a8.3 8.3 0 0 0 .69-.033Z" clipRule="evenodd" />
            </svg>
            {overall.toFixed(2)} · {count} reviews
          </span>
          <span>·</span>
          <span className="underline">{listing.city}, {listing.country}</span>
          <span>·</span>
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-primary">
            {isHome && listing.home_type
              ? homeTypeLabel(listing.home_type)
              : categoryLabel(listing.category === "stays" ? "homes" : listing.category)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-primary/15 bg-card p-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {isHome
              ? `${homeTypeLabel(listing.home_type)} hosted by ${listing.host_name ?? "Host"}`
              : `${listingType === "experiences" ? "Experience" : "Service"} hosted by ${listing.host_name ?? "Host"}`}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {isHome
              ? `${listing.max_guests} guests · ${listing.bedrooms} bedroom${listing.bedrooms !== 1 ? "s" : ""} · ${listing.bathrooms} bath${listing.bathrooms !== 1 ? "s" : ""}`
              : `Up to ${listing.max_guests} guests`}
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
          {hostInitial}
        </div>
      </div>

      <Divider />

      <div className="space-y-6">
        <Highlight
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
            </svg>
          }
          title="Top rated"
          subtitle="One of the highest-rated listings on Stay N Go."
        />
        <Highlight
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>
          }
          title="Self check-in"
          subtitle="Check yourself in with the keypad."
        />
        <Highlight
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          }
          title="Free cancellation"
          subtitle="Cancel before check-in for a full refund."
        />
      </div>

      <Divider />

      <section>
        <p className="whitespace-pre-line text-base leading-7 text-foreground/90">
          {listing.description}
        </p>
        <button className="mt-4 flex items-center gap-1 font-semibold text-foreground underline">
          Show more
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </section>

      <Divider />

      <section>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          What this place offers
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-3 text-foreground/80">
              <svg className="h-5 w-5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {amenity}
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="mb-2 text-xl font-semibold text-foreground">Where you&apos;ll be</h2>
        <p className="mb-4 text-muted">
          {isHome && addressLines.length > 0 ? (
            addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))
          ) : (
            <>
              {listing.city}, {listing.country}
            </>
          )}
        </p>
        <div className="flex h-64 items-center justify-center rounded-2xl border border-primary/15 bg-accent">
          <div className="text-center">
            <svg className="mx-auto h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <p className="mt-2 text-sm font-medium text-muted">
              {listing.city}, {listing.country}
            </p>
            <p className="text-xs text-muted/80">Exact location provided after booking</p>
          </div>
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="mb-6 text-xl font-semibold text-foreground">Meet your host</h2>
        <div className="flex flex-col gap-6 rounded-2xl border border-primary/15 bg-card p-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white">
            {hostInitial}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{listing.host_name ?? "Your host"}</p>
            <p className="mt-1 text-sm text-muted">Host · Joined Stay N Go</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Superhosts are experienced, highly rated hosts committed to providing
              great stays for guests. {listing.host_name?.split(" ")[0] ?? "This host"} is known
              for fast responses and thoughtful hospitality.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      <ListingReviews listing={listing} />
    </div>
  );
}
