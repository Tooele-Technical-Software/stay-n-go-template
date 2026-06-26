"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { authFetch } from "@/lib/auth-api";
import { getListingType } from "@/lib/categories";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ListingForm from "@/components/host/ListingForm";
import type { Listing } from "@/types/listing";

export default function HostEditPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!token || !listingId) return;

    authFetch<{ listing: Listing }>(`/listings/mine/${listingId}`, token)
      .then((data) => {
        if (getListingType(data.listing) !== "homes") {
          setLoadError("Only home listings can be edited here.");
          return;
        }
        setListing(data.listing);
      })
      .catch(() => setLoadError("Could not load this listing."))
      .finally(() => setLoading(false));
  }, [token, listingId]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard?tab=hosting"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-foreground">Edit listing</h1>
        <p className="mt-2 text-muted">Update your home&apos;s details and save when you&apos;re done.</p>

        {loading && (
          <p className="mt-8 text-center text-muted">Loading listing...</p>
        )}

        {loadError && (
          <p className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {loadError}
          </p>
        )}

        {!loading && listing && (
          <ListingForm mode="edit" listingId={listingId} initialListing={listing} />
        )}
      </div>
    </DashboardShell>
  );
}
