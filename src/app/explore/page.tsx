"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ExploreFilters, ExploreTab } from "@/lib/categories";
import {
  applyFilters,
  defaultFilters,
  exploreTabs,
  getListingType,
} from "@/lib/categories";
import type { Listing } from "@/types/listing";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ExploreNav from "@/components/explore/ExploreNav";
import ExploreFiltersPanel from "@/components/explore/ExploreFiltersPanel";
import ExploreCard from "@/components/explore/ExploreCard";

export default function ExplorePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ExploreTab>("homes");
  const [filters, setFilters] = useState<ExploreFilters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    apiFetch<{ listings: Listing[] }>("/listings")
      .then((data) => setListings(data.listings))
      .catch(() =>
        setError("Could not load listings. Is the API server running?")
      )
      .finally(() => setLoading(false));
  }, []);

  const tabCounts = useMemo(() => {
    const counts: Record<ExploreTab, number> = {
      homes: 0,
      services: 0,
      experiences: 0,
    };
    for (const listing of listings) {
      counts[getListingType(listing)]++;
    }
    return counts;
  }, [listings]);

  const tabListings = useMemo(
    () => listings.filter((l) => getListingType(l) === activeTab),
    [listings, activeTab]
  );

  const filtered = useMemo(
    () => applyFilters(listings, activeTab, filters),
    [listings, activeTab, filters]
  );

  const availableCities = useMemo(() => {
    const cities = new Set(tabListings.map((l) => l.city));
    return Array.from(cities).sort();
  }, [tabListings]);

  const priceRange = useMemo(() => {
    if (tabListings.length === 0) return { min: 0, max: 500 };
    const prices = tabListings.map((l) => parseFloat(l.price_per_night));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [tabListings]);

  function handleTabChange(tab: ExploreTab) {
    setActiveTab(tab);
    setFilters(defaultFilters);
    setMobileFiltersOpen(false);
  }

  const tabLabel = exploreTabs.find((t) => t.id === activeTab)?.label ?? "";

  return (
    <DashboardShell>
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-foreground">Explore</h1>
        <p className="mt-2 text-muted">
          Browse homes, services, and experiences for your next trip.
        </p>
      </div>

      <ExploreNav
        active={activeTab}
        onChange={handleTabChange}
        counts={tabCounts}
      />

      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/15 bg-card py-3 text-sm font-semibold text-foreground lg:hidden"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        Filters
      </button>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
          <ExploreFiltersPanel
            tab={activeTab}
            filters={filters}
            onChange={setFilters}
            availableCities={availableCities}
            priceRange={priceRange}
          />
        </div>

        <div className="min-w-0 flex-1">
          {loading && (
            <p className="text-center text-muted">Loading...</p>
          )}
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <p className="mb-5 text-sm text-muted">
                {filtered.length} {tabLabel.toLowerCase()} found
              </p>

              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-primary/25 bg-card px-8 py-16 text-center">
                  <p className="text-muted">
                    No {tabLabel.toLowerCase()} match your filters.
                  </p>
                  <button
                    onClick={() => setFilters(defaultFilters)}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((listing) => (
                    <ExploreCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
