"use client";

import type { ExploreFilters, ExploreTab } from "@/lib/categories";
import {
  categoryLabel,
  countActiveFilters,
  defaultFilters,
  subcategoriesForTab,
} from "@/lib/categories";

export default function ExploreFiltersPanel({
  tab,
  filters,
  onChange,
  availableCities,
  priceRange,
}: {
  tab: ExploreTab;
  filters: ExploreFilters;
  onChange: (filters: ExploreFilters) => void;
  availableCities: string[];
  priceRange: { min: number; max: number };
}) {
  const activeCount = countActiveFilters(filters, tab);
  const subcategories = subcategoriesForTab(tab).filter((c) => c !== "homes");

  function toggleCity(city: string) {
    const cities = filters.cities.includes(city)
      ? filters.cities.filter((c) => c !== city)
      : [...filters.cities, city];
    onChange({ ...filters, cities });
  }

  function toggleSubcategory(sub: string) {
    const subcategories = filters.subcategories.includes(sub)
      ? filters.subcategories.filter((s) => s !== sub)
      : [...filters.subcategories, sub];
    onChange({ ...filters, subcategories });
  }

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="sticky top-24 rounded-2xl border border-primary/15 bg-card p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Filters</h2>
          {activeCount > 0 && (
            <button
              onClick={() => onChange({ ...defaultFilters })}
              className="text-xs font-medium text-primary hover:underline"
            >
              Clear all ({activeCount})
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Price */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground/80">Price range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={`$${priceRange.min}`}
                min={0}
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    minPrice: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <span className="text-muted/80">–</span>
              <input
                type="number"
                placeholder={`$${priceRange.max}`}
                min={0}
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    maxPrice: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* City */}
          {availableCities.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground/80">City</h3>
              <div className="space-y-2">
                {availableCities.map((city) => (
                  <label
                    key={city}
                    className="flex cursor-pointer items-center gap-2 text-sm text-muted"
                  >
                    <input
                      type="checkbox"
                      checked={filters.cities.includes(city)}
                      onChange={() => toggleCity(city)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    {city}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Homes-only filters */}
          {tab === "homes" && (
            <>
              <div>
                <h3 className="mb-3 text-sm font-medium text-foreground/80">
                  Minimum guests
                </h3>
                <select
                  value={filters.minGuests ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      minGuests: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="">Any</option>
                  {[1, 2, 4, 6, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}+ guests
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-foreground/80">
                  Minimum bedrooms
                </h3>
                <select
                  value={filters.minBedrooms ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      minBedrooms: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}+ bedrooms
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Subcategory filters for services & experiences */}
          {subcategories.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground/80">
                {tab === "services" ? "Service type" : "Experience type"}
              </h3>
              <div className="space-y-2">
                {subcategories.map((sub) => (
                  <label
                    key={sub}
                    className="flex cursor-pointer items-center gap-2 text-sm text-muted"
                  >
                    <input
                      type="checkbox"
                      checked={filters.subcategories.includes(sub)}
                      onChange={() => toggleSubcategory(sub)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    {categoryLabel(sub)}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
