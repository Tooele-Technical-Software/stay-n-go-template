import Link from "next/link";
import type { Listing } from "@/types/listing";
import { getListingType } from "@/lib/categories";
import ListingCard from "./ListingCard";
import EmptyState from "./EmptyState";

export default function HostingPanel({
  listings,
  counts,
  onListingUpdate,
}: {
  listings: Listing[];
  counts: { homes: number; services: number; experiences: number };
  onListingUpdate?: (listing: Listing) => void;
}) {
  if (listings.length === 0) {
    return (
      <EmptyState
        title="Start hosting on Stay N Go"
        description="List a home, service, or experience and start earning. Your listings will appear here and on Explore."
        actionLabel="Create a listing"
        actionHref="/host"
      />
    );
  }

  const grouped = {
    homes: listings.filter((l) => getListingType(l) === "homes"),
    services: listings.filter((l) => getListingType(l) === "services"),
    experiences: listings.filter((l) => getListingType(l) === "experiences"),
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Your listings</h2>
          <p className="text-sm text-muted">
            {counts.homes} home{counts.homes !== 1 ? "s" : ""} · {counts.services}{" "}
            service{counts.services !== 1 ? "s" : ""} · {counts.experiences}{" "}
            experience{counts.experiences !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/host"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-colors hover:bg-primary-dark"
        >
          + New listing
        </Link>
      </div>

      {(["homes", "services", "experiences"] as const).map((type) => {
        const items = grouped[type];
        if (items.length === 0) return null;
        const label =
          type === "homes" ? "Homes" : type === "services" ? "Services" : "Experiences";
        return (
          <section key={type} className="mb-10">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {label}
              <span className="ml-2 text-sm font-normal text-muted">
                ({items.length})
              </span>
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {items.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onListingUpdate={onListingUpdate}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
