"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import LogoLink from "@/components/LogoLink";
import ThemeToggle from "@/components/ThemeToggle";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getListingPhotos } from "@/lib/listing-photos";
import type { Listing } from "@/types/listing";
import ListingGallery from "@/components/listing/ListingGallery";
import ListingContent from "@/components/listing/ListingContent";
import BookingCard from "@/components/listing/BookingCard";

function ListingDetail() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ listing: Listing }>(`/listings/${id}`)
      .then((data) => setListing(data.listing))
      .catch(() => setError("Listing not found or API unavailable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-muted">Loading listing...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6">
        <p className="text-muted">{error || "Listing not found."}</p>
        <Link href="/explore" className="mt-4 font-medium text-primary hover:underline">
          ← Back to explore
        </Link>
      </div>
    );
  }

  const photos = getListingPhotos(listing);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-primary/15 bg-card">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/explore"
            className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back to explore
          </Link>
          <LogoLink size="sm" textClassName="hidden sm:inline" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="hidden rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent sm:block">
              Share
            </button>
            <button className="hidden rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent sm:block">
              Save
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-8">
        <ListingGallery photos={photos} title={listing.title} />

        <div className="relative grid gap-12 lg:grid-cols-[1fr_380px]">
          <ListingContent listing={listing} />

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <BookingCard listing={listing} />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-primary/15 bg-card p-4 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-lg font-semibold text-foreground">
                ${parseFloat(listing.price_per_night).toFixed(0)}
              </span>
              <span className="text-sm text-muted"> / night</span>
            </div>
            <Link
              href="#book"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("mobile-booking")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Reserve
            </Link>
          </div>
        </div>

        <div id="mobile-booking" className="mt-8 pb-24 lg:hidden">
          <BookingCard listing={listing} />
        </div>
      </main>
    </div>
  );
}

export default function ListingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface">
          <p className="text-muted">Loading...</p>
        </div>
      }
    >
      <ListingDetail />
    </Suspense>
  );
}
