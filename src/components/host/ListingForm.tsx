"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { authFetch } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/countries";
import { HOME_TYPES } from "@/lib/home-types";
import {
  categoryLabel,
  EXPERIENCE_CATEGORIES,
  exploreTabs,
  getListingType,
  SERVICE_CATEGORIES,
  type ExploreTab,
} from "@/lib/categories";
import {
  bathroomOptions,
  bedroomOptions,
  experiencePriceSuggestions,
  guestLabel,
  guestOptions,
  homePriceSuggestions,
  initGuestSelect,
  initRoomSelect,
  MAX_BATHROOMS,
  MAX_BEDROOMS,
  normalizePriceInput,
  parseRoomCount,
  roomLabel,
} from "@/lib/host-form-utils";
import { inputClassName, labelClassName, selectClassName } from "@/lib/form-classes";
import type { Listing } from "@/types/listing";

const categoryOptions: Record<ExploreTab, readonly string[]> = {
  homes: ["homes"],
  services: SERVICE_CATEGORIES,
  experiences: EXPERIENCE_CATEGORIES,
};

function countryOptions(current: string) {
  if (COUNTRIES.includes(current as (typeof COUNTRIES)[number])) {
    return COUNTRIES;
  }
  return [current, ...COUNTRIES];
}

function listingToFormState(listing: Listing) {
  const listingType = getListingType(listing);
  const isHome = listingType === "homes";
  const bedroomState = initRoomSelect(
    listing.bedrooms,
    bedroomOptions[bedroomOptions.length - 1],
    MAX_BEDROOMS
  );
  const bathroomState = initRoomSelect(
    listing.bathrooms,
    bathroomOptions[bathroomOptions.length - 1],
    MAX_BATHROOMS
  );

  return {
    listingType,
    category: listing.category === "stays" ? "homes" : listing.category,
    title: listing.title,
    description: listing.description,
    city: listing.city,
    address: listing.address ?? "",
    addressLine2: listing.address_line_2 ?? "",
    zipCode: listing.zip_code ?? "",
    homeType: listing.home_type ?? "apartment",
    country: listing.country,
    pricePerNight: String(parseFloat(listing.price_per_night)),
    maxGuests: initGuestSelect(listing.max_guests),
    bedroomsSelect: bedroomState.select,
    bedroomsCustom: bedroomState.custom,
    bathroomsSelect: bathroomState.select,
    bathroomsCustom: bathroomState.custom,
    isHome,
  };
}

export default function ListingForm({
  mode,
  listingId,
  initialListing,
}: {
  mode: "create" | "edit";
  listingId?: string;
  initialListing?: Listing;
}) {
  const { token } = useAuth();
  const router = useRouter();
  const isEdit = mode === "edit";

  const [listingType, setListingType] = useState<ExploreTab>(
    initialListing ? getListingType(initialListing) : "homes"
  );
  const [category, setCategory] = useState(
    initialListing
      ? initialListing.category === "stays"
        ? "homes"
        : initialListing.category
      : "homes"
  );
  const [title, setTitle] = useState(initialListing?.title ?? "");
  const [description, setDescription] = useState(initialListing?.description ?? "");
  const [city, setCity] = useState(initialListing?.city ?? "");
  const [address, setAddress] = useState(initialListing?.address ?? "");
  const [addressLine2, setAddressLine2] = useState(initialListing?.address_line_2 ?? "");
  const [zipCode, setZipCode] = useState(initialListing?.zip_code ?? "");
  const [homeType, setHomeType] = useState(initialListing?.home_type ?? "apartment");
  const [country, setCountry] = useState(initialListing?.country ?? DEFAULT_COUNTRY);
  const [pricePerNight, setPricePerNight] = useState(
    initialListing ? String(parseFloat(initialListing.price_per_night)) : ""
  );
  const [maxGuests, setMaxGuests] = useState(
    initialListing ? initGuestSelect(initialListing.max_guests) : "2"
  );
  const [bedroomsSelect, setBedroomsSelect] = useState(
    initialListing
      ? initRoomSelect(
          initialListing.bedrooms,
          bedroomOptions[bedroomOptions.length - 1],
          MAX_BEDROOMS
        ).select
      : "1"
  );
  const [bedroomsCustom, setBedroomsCustom] = useState(
    initialListing
      ? initRoomSelect(
          initialListing.bedrooms,
          bedroomOptions[bedroomOptions.length - 1],
          MAX_BEDROOMS
        ).custom
      : ""
  );
  const [bathroomsSelect, setBathroomsSelect] = useState(
    initialListing
      ? initRoomSelect(
          initialListing.bathrooms,
          bathroomOptions[bathroomOptions.length - 1],
          MAX_BATHROOMS
        ).select
      : "1"
  );
  const [bathroomsCustom, setBathroomsCustom] = useState(
    initialListing
      ? initRoomSelect(
          initialListing.bathrooms,
          bathroomOptions[bathroomOptions.length - 1],
          MAX_BATHROOMS
        ).custom
      : ""
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialListing) {
      const state = listingToFormState(initialListing);
      setListingType(state.listingType);
      setCategory(state.category);
      setTitle(state.title);
      setDescription(state.description);
      setCity(state.city);
      setAddress(state.address);
      setAddressLine2(state.addressLine2);
      setZipCode(state.zipCode);
      setHomeType(state.homeType);
      setCountry(state.country);
      setPricePerNight(state.pricePerNight);
      setMaxGuests(state.maxGuests);
      setBedroomsSelect(state.bedroomsSelect);
      setBedroomsCustom(state.bedroomsCustom);
      setBathroomsSelect(state.bathroomsSelect);
      setBathroomsCustom(state.bathroomsCustom);
    }
  }, [initialListing]);

  function handleTypeChange(type: ExploreTab) {
    if (isEdit) return;
    setListingType(type);
    setCategory(categoryOptions[type][0]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError("");

    const price = parseFloat(pricePerNight);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid price greater than $0.");
      return;
    }

    const isHome = listingType === "homes";
    const bedrooms = isHome
      ? parseRoomCount(bedroomsSelect, bedroomsCustom, MAX_BEDROOMS)
      : 0;
    const bathrooms = isHome
      ? parseRoomCount(bathroomsSelect, bathroomsCustom, MAX_BATHROOMS)
      : 0;

    if (isHome && bedroomsSelect.endsWith("+") && bedrooms < MAX_BEDROOMS) {
      setError(`Please enter at least ${MAX_BEDROOMS} bedrooms.`);
      return;
    }
    if (isHome && bathroomsSelect.endsWith("+") && bathrooms < MAX_BATHROOMS) {
      setError(`Please enter at least ${MAX_BATHROOMS} bathrooms.`);
      return;
    }
    if (isHome && !address.trim()) {
      setError("Please enter a street address for your home.");
      return;
    }
    if (isHome && !zipCode.trim()) {
      setError("Please enter a ZIP or postal code.");
      return;
    }

    const payload = {
      title,
      description,
      city,
      country,
      ...(isHome && {
        address: address.trim(),
        address_line_2: addressLine2.trim() || null,
        zip_code: zipCode.trim(),
        home_type: homeType,
      }),
      price_per_night: price,
      max_guests: parseInt(maxGuests, 10),
      bedrooms,
      bathrooms,
      category,
      ...(mode === "create" && { listing_type: listingType }),
    };

    setSubmitting(true);

    try {
      if (mode === "create") {
        await authFetch("/listings", token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else if (listingId) {
        await authFetch(`/listings/${listingId}`, token, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      }
      router.push("/dashboard?tab=hosting");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : mode === "create"
            ? "Failed to create listing"
            : "Failed to update listing"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const priceLabel =
    listingType === "homes" ? "Price per night" : "Price per person";

  const priceSuggestions =
    listingType === "homes" ? homePriceSuggestions : experiencePriceSuggestions;

  const titlePlaceholder =
    listingType === "homes"
      ? "Cozy downtown apartment"
      : listingType === "services"
        ? "In-home spa & massage"
        : "Sunset food tour";

  const bedroomsOverMax = bedroomsSelect.endsWith("+");
  const bathroomsOverMax = bathroomsSelect.endsWith("+");
  const countries = countryOptions(country);

  return (
    <>
      {isEdit ? (
        <div className="mt-6 rounded-full border border-primary/20 bg-card px-4 py-2.5 text-center text-sm font-semibold text-primary">
          Editing {exploreTabs.find((t) => t.id === listingType)?.label ?? "listing"}
        </div>
      ) : (
        <div className="mt-6 flex rounded-full border border-primary/20 bg-card p-1 shadow-sm">
          {exploreTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTypeChange(tab.id)}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                listingType === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-primary/15 bg-card p-8 shadow-md shadow-primary/5"
      >
        {listingType !== "homes" && (
          <div>
            <label htmlFor="category" className={labelClassName}>
              {listingType === "services" ? "Service type" : "Experience type"}
            </label>
            <select
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClassName}
              disabled={isEdit}
            >
              {categoryOptions[listingType].map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="title" className={labelClassName}>
            Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Description
          </label>
          <textarea
            id="description"
            required
            minLength={10}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what guests can expect — amenities, vibe, and what makes your listing special."
            className={`${inputClassName} min-h-[120px] resize-y`}
          />
        </div>

        <div className="space-y-5">
          {listingType === "homes" && (
            <>
              <div>
                <label htmlFor="address" className={labelClassName}>
                  Street address
                </label>
                <input
                  id="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St"
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="address-line-2" className={labelClassName}>
                  Address line 2{" "}
                  <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  id="address-line-2"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apartment, suite, unit, building, or other details"
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="home-type" className={labelClassName}>
                  Type of home
                </label>
                <select
                  id="home-type"
                  required
                  value={homeType}
                  onChange={(e) => setHomeType(e.target.value)}
                  className={selectClassName}
                >
                  {HOME_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className={labelClassName}>
                City
              </label>
              <input
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Austin"
                className={inputClassName}
              />
            </div>
            {listingType === "homes" ? (
              <div>
                <label htmlFor="zip-code" className={labelClassName}>
                  ZIP / postal code
                </label>
                <input
                  id="zip-code"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="78701"
                  className={inputClassName}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="country" className={labelClassName}>
                  Country
                </label>
                <select
                  id="country"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={selectClassName}
                >
                  {countries.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {listingType === "homes" && (
            <div>
              <label htmlFor="country" className={labelClassName}>
                Country
              </label>
              <select
                id="country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={selectClassName}
              >
                {countries.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="price" className={labelClassName}>
              {priceLabel}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                $
              </span>
              <input
                id="price"
                required
                type="text"
                inputMode="decimal"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(normalizePriceInput(e.target.value))}
                placeholder="0"
                className={`${inputClassName} pl-8 text-lg font-medium`}
              />
            </div>
            <p className="mt-2 text-xs text-muted">Quick select a common price:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {priceSuggestions.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setPricePerNight(String(amount))}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    pricePerNight === String(amount)
                      ? "border-primary bg-primary text-white"
                      : "border-primary/20 bg-accent text-foreground/80 hover:border-primary hover:text-primary"
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="max-guests" className={labelClassName}>
              Max guests
            </label>
            <select
              id="max-guests"
              required
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              className={selectClassName}
            >
              {guestOptions.map((count) => (
                <option key={count} value={count}>
                  {guestLabel(count)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {listingType === "homes" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="bedrooms" className={labelClassName}>
                Bedrooms
              </label>
              <select
                id="bedrooms"
                value={bedroomsSelect}
                onChange={(e) => {
                  setBedroomsSelect(e.target.value);
                  if (!e.target.value.endsWith("+")) setBedroomsCustom("");
                }}
                className={selectClassName}
              >
                {bedroomOptions.map((count) => (
                  <option key={count} value={String(count)}>
                    {roomLabel(count, "bedroom")}
                  </option>
                ))}
                <option value={`${MAX_BEDROOMS}+`}>{MAX_BEDROOMS}+ bedrooms</option>
              </select>
              {bedroomsOverMax && (
                <div className="mt-3">
                  <label htmlFor="bedrooms-custom" className={labelClassName}>
                    Exact bedroom count
                  </label>
                  <input
                    id="bedrooms-custom"
                    type="number"
                    min={MAX_BEDROOMS}
                    required
                    value={bedroomsCustom}
                    onChange={(e) => setBedroomsCustom(e.target.value)}
                    placeholder={`${MAX_BEDROOMS} or more`}
                    className={inputClassName}
                  />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="bathrooms" className={labelClassName}>
                Bathrooms
              </label>
              <select
                id="bathrooms"
                value={bathroomsSelect}
                onChange={(e) => {
                  setBathroomsSelect(e.target.value);
                  if (!e.target.value.endsWith("+")) setBathroomsCustom("");
                }}
                className={selectClassName}
              >
                {bathroomOptions.map((count) => (
                  <option key={count} value={String(count)}>
                    {roomLabel(count, "bathroom")}
                  </option>
                ))}
                <option value={`${MAX_BATHROOMS}+`}>{MAX_BATHROOMS}+ bathrooms</option>
              </select>
              {bathroomsOverMax && (
                <div className="mt-3">
                  <label htmlFor="bathrooms-custom" className={labelClassName}>
                    Exact bathroom count
                  </label>
                  <input
                    id="bathrooms-custom"
                    type="number"
                    min={MAX_BATHROOMS}
                    required
                    value={bathroomsCustom}
                    onChange={(e) => setBathroomsCustom(e.target.value)}
                    placeholder={`${MAX_BATHROOMS} or more`}
                    className={inputClassName}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting
            ? isEdit
              ? "Saving..."
              : "Publishing..."
            : isEdit
              ? "Save changes"
              : `Publish ${listingType.slice(0, -1)}`}
        </button>
      </form>
    </>
  );
}
