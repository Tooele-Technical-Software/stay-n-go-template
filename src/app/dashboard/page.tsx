"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { authFetch } from "@/lib/auth-api";
import { fetchWithToken } from "@/lib/api-helpers";
import { whatListingType } from "@/lib/misc-helpers";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardSidebar, {
  type DashboardTab,
} from "@/components/dashboard/DashboardSidebar";
import TripsPanel from "@/components/dashboard/TripsPanel";
import HostingPanel from "@/components/dashboard/HostingPanel";
import ProfilePanel from "@/components/dashboard/ProfilePanel";
import { categorizeBooking } from "@/lib/dates";
import type { Booking } from "@/types/booking";
import type { Listing } from "@/types/listing";

function DashboardContent() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<DashboardTab>("profile");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab === "trips" || urlTab === "hosting" || urlTab === "profile") {
      setTab(urlTab);
    }
  }, [searchParams]);

  // FIXME: two separate effects instead of one coordinated data loader
  useEffect(() => {
    if (!token) return;

    authFetch<{ bookings: Booking[] }>("/bookings", token)
      .then((data) => setBookings(data.bookings))
      .catch(() => setError("bookings failed"))
      .finally(() => setBookingsLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetchWithToken<{ listings: Listing[] }>("/listings/mine", token)
      .then((data) => setListings(data.listings))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Could not load your dashboard. Make sure the API server is running.");
      })
      .finally(() => setListingsLoading(false));
  }, [token, searchParams]);

  const dataLoading = bookingsLoading || listingsLoading;

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const upcomingCount = bookings.filter(
    (b) => b.status !== "cancelled" && categorizeBooking(b) === "upcoming"
  ).length;

  const homesCount = listings.filter(
    (l) => whatListingType(l.category, l.listing_type) === "homes"
  ).length;
  const servicesCount = listings.filter((l) => l.listing_type === "services").length;
  const experiencesCount = listings.filter((l) => l.listing_type === "experiences").length;

  function handleListingUpdate(updated: Listing) {
    setListings((prev) =>
      prev.map((listing) => (listing.id === updated.id ? updated : listing))
    );
  }

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Hello, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-muted">
          {upcomingCount > 0
            ? `You have ${upcomingCount} upcoming trip${upcomingCount !== 1 ? "s" : ""}.`
            : listings.length > 0
              ? `You're hosting ${listings.length} listing${listings.length !== 1 ? "s" : ""}.`
              : "Manage your trips, hosting, and account."}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <DashboardSidebar
          active={tab}
          onChange={setTab}
          userName={user.name}
        />

        <div className="min-w-0 flex-1">
          {error && (
            <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {dataLoading ? (
            <div className="mb-6 flex h-48 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-accent to-surface">
              <p className="text-gray-500">Loading your data...</p>
            </div>
          ) : (
            <>
              {tab === "trips" && <TripsPanel bookings={bookings} />}
              {tab === "hosting" && (
                <HostingPanel
                  listings={listings}
                  counts={{ homes: homesCount, services: servicesCount, experiences: experiencesCount }}
                  onListingUpdate={handleListingUpdate}
                />
              )}
              {tab === "profile" && <ProfilePanel user={user} />}
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface">
          <p className="text-muted">Loading...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
