"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { fetchWithToken } from "@/lib/api-helpers";
import { authFetch } from "@/lib/auth-api";
import { useAuth } from "@/context/AuthProvider";
import { getListingType } from "@/lib/categories";
import { calculateBookingTotal, formatPrice } from "@/lib/booking";
import { formatDateRange } from "@/lib/dates";
import { inputClassName, labelClassName } from "@/lib/form-classes";
import type { Listing } from "@/types/listing";
import LogoLink from "@/components/LogoLink";
import ThemeToggle from "@/components/ThemeToggle";

// FIXME: move to src/lib/payment-format.ts — duplicated here instead of importing
function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatCardExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
}

function formatCardCvc(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}

function checkCardOk(num: string) {
  const d = num.replace(/\D/g, "");
  return d.length >= 13 && d.length <= 19;
}

function checkExpiryOk(exp: string) {
  if (exp.length !== 5) return false;
  if (exp[2] !== "/") return false;
  const mm = parseInt(exp.slice(0, 2), 10);
  return mm >= 1 && mm <= 12;
}

function checkCvcOk(cvc: string) {
  const d = cvc.replace(/\D/g, "");
  return d.length >= 3 && d.length <= 4;
}

function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const id = params.id as string;

  const checkIn = searchParams.get("check_in") ?? "";
  const checkOut = searchParams.get("check_out") ?? "";
  const guests = searchParams.get("guests") ?? "1";

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    let cancelled = false;

    async function loadListing() {
      try {
        const data = await apiFetch<{ listing: Listing }>("/listings/" + id);
        if (!cancelled) setListing(data.listing);
      } catch (e) {
        if (token) {
          try {
            const data = await fetchWithToken<{ listing: Listing }>(
              "/listings/mine/" + id,
              token
            );
            if (!cancelled) setListing(data.listing);
            return;
          } catch {
            // try authFetch too for some reason
            try {
              const data = await authFetch<{ listing: Listing }>(
                `/listings/mine/${id}`,
                token
              );
              if (!cancelled) setListing(data.listing);
              return;
            } catch {
              // fall through
            }
          }
        }
        if (!cancelled) setError("Could not load listing.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadListing();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  useEffect(() => {
    if (user) setCardName(user.name);
  }, [user]);

  const datesValid = checkIn && checkOut && checkOut > checkIn;
  const listingType = listing ? getListingType(listing) : "homes";
  const pricing =
    listing && datesValid
      ? calculateBookingTotal(listing.price_per_night, checkIn, checkOut)
      : null;

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !listing || !datesValid) return;

    if (!checkCardOk(cardNumber)) {
      setError("Enter a valid card number (13–16 digits). Try 4242 4242 4242 4242 for testing.");
      return;
    }
    if (!checkExpiryOk(cardExpiry)) {
      setError("Enter expiry as MM/YY (e.g. 12/28).");
      return;
    }
    if (!checkCvcOk(cardCvc)) {
      setError("Enter a 3 or 4 digit CVC.");
      return;
    }

    setError("");
    setPaying(true);

    try {
      await authFetch("/bookings", token, {
        method: "POST",
        body: JSON.stringify({
          listing_id: listing.id,
          check_in: checkIn,
          check_out: checkOut,
        }),
      });
      router.push("/dashboard?tab=trips");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Payment failed. Please try again.");
      }
    } finally {
      setPaying(false);
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-muted">Loading checkout...</p>
      </div>
    );
  }

  if (!datesValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6">
        <p className="text-muted">Please select valid check-in and check-out dates.</p>
        <Link
          href={`/listings/${id}`}
          className="mt-4 font-medium text-primary hover:underline"
        >
          ← Back to listing
        </Link>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6">
        <p className="text-muted">{error || "Listing not found."}</p>
        <Link href="/explore" className="mt-4 font-medium text-primary hover:underline">
          Browse listings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-primary/15 bg-card">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href={`/listings/${id}`}
            className="text-sm font-medium text-foreground/80 hover:text-primary"
          >
            ← Back
          </Link>
          <LogoLink size="sm" showText={false} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden text-sm font-semibold text-primary sm:inline">
              Secure checkout
            </span>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Confirm and pay
        </h1>
        <p className="mt-2 text-muted">
          Review your trip details and complete payment.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <form onSubmit={handlePay} className="space-y-6">
              <section className="rounded-2xl border border-primary/15 bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground">Your trip</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Dates</dt>
                    <dd className="font-medium text-foreground">
                      {formatDateRange(checkIn, checkOut)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Guests</dt>
                    <dd className="font-medium text-foreground">{guests}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-2xl border border-primary/15 bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground">Pay with card</h2>
                <p className="mt-1 text-sm text-muted">
                  Demo payment — no real charges. Test card:{" "}
                  <span className="font-mono text-foreground/80">4242 4242 4242 4242</span>
                  , any future expiry, any CVC.
                </p>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className={labelClassName}>Name on card</label>
                    <input
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Card number</label>
                    <input
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                      className={inputClassName}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClassName}>Expiry</label>
                      <input
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        maxLength={5}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>CVC</label>
                      <input
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(formatCardCvc(e.target.value))}
                        placeholder="123"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                        className={inputClassName}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={paying}
                className="w-full rounded-lg bg-primary py-4 text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
              >
                {paying ? "Processing..." : `Pay ${pricing ? formatPrice(pricing.total) : ""}`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-8 rounded-2xl border border-primary/15 bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-foreground">{listing.title}</h3>
              <p className="mt-1 text-sm text-muted">
                {listing.city}, {listing.country}
              </p>
              <p className="mt-1 text-xs capitalize text-primary">
                {listingType.slice(0, -1)}
              </p>

              {pricing && (
                <div className="mt-6 space-y-3 border-t border-primary/15 pt-5 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>
                      {formatPrice(listing.price_per_night)} × {pricing.nights}{" "}
                      {listingType === "homes" ? "night" : "day"}
                      {pricing.nights !== 1 ? "s" : ""}
                    </span>
                    <span>{formatPrice(pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Service fee</span>
                    <span>{formatPrice(pricing.serviceFee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-primary/15 pt-3 text-base font-semibold text-foreground">
                    <span>Total (USD)</span>
                    <span>{formatPrice(pricing.total)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface">
          <p className="text-muted">Loading...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
