# FIXME — Code Quality Refactor Guide

This branch (`broken`) intentionally contains **junior-level code patterns**: duplicated logic, oversized files, inconsistent abstractions, and scattered configuration. The app should still run end-to-end, but the codebase is harder to maintain than it should be.

Your job is to refactor toward professional structure **without changing user-visible behavior** (unless noted as a known inconsistency below).

---

## How to use this document

1. Work through the items below in any order, or assign one item per PR.
2. After each fix, manually smoke-test: login, explore, host a listing, checkout, dashboard tabs.
3. When an item is done, remove related `FIXME` comments from the code.
4. Do **not** delete this file until the refactor track is complete (or move resolved items to a changelog).

---

## 1. God components — pages do too much

### Problem

Large page files mix data loading, validation, routing guards, formatting, and UI markup. This makes testing and reuse difficult.

### Files to fix

| File | What's wrong |
|------|----------------|
| `src/app/listings/[id]/checkout/page.tsx` | ~350+ lines: auth redirect, listing fetch (two strategies), card validation, payment submit, full layout |
| `src/app/explore/page.tsx` | Fetching, tab counts, filtering, price range, mobile filter state, and grid rendering in one component |
| `src/app/dashboard/page.tsx` | Separate loading paths for bookings vs listings, tab state, greeting copy, and three panels |
| `src/components/host/ListingForm.tsx` | Large form with validation, API calls, and many field groups inline |

### What to do

- Extract custom hooks: `useCheckout`, `useExploreListings`, `useDashboardData`, `useListingForm`.
- Split presentational sections into smaller components (`CheckoutTripSummary`, `CheckoutPaymentForm`, etc.).
- Keep pages as thin composition layers.

### Acceptance criteria

- No page file over ~150 lines of logic (excluding JSX for static layout).
- Data fetching lives in hooks or a service layer, not inline in multiple `useEffect` blocks.

---

## 2. Duplicated UI and placeholder logic

### Problem

Listing/trip cards each implement their own gradient placeholder image logic with slightly different hue arrays and helpers.

### Files to fix

| File | Issue |
|------|--------|
| `src/components/explore/ExploreCard.tsx` | `getExploreCardGradient` + `makeGradient` from misc-helpers — two code paths |
| `src/components/dashboard/ListingCard.tsx` | Local `placeholderGradient` function |
| `src/components/dashboard/TripCard.tsx` | Another local `placeholderGradient` with different HSL values |
| `src/lib/misc-helpers.ts` | `makeGradient`, `getHueForCity` — partial duplicate |

### What to do

- Create `src/components/listing/ListingPlaceholderImage.tsx` (or `src/lib/listing-placeholder.ts`).
- Use one gradient algorithm everywhere.
- Share price/meta line components if patterns match (`ListingMeta`, `ListingPrice`).

---

## 3. Multiple API / fetch layers

### Problem

HTTP calls are spread across several wrappers with inconsistent error types and base URLs.

### Files to fix

| File | Issue |
|------|--------|
| `src/lib/api.ts` | `apiFetch` + `ApiError` |
| `src/lib/auth-api.ts` | Thin wrapper over `apiFetch` |
| `src/lib/api-helpers.ts` | **Duplicate** `fetchListingsForExplore`, `fetchWithToken` using raw `fetch` + generic `Error` |
| `src/lib/app-config.ts` | **Duplicate** `API_BASE` / `API_BASE_FROM_ENV` — hardcoded `localhost:4000` |

### Current inconsistent usage

- **Explore** uses `fetchListingsForExplore` from `api-helpers.ts`
- **Dashboard** uses `authFetch` for bookings but `fetchWithToken` for listings
- **Checkout** uses `apiFetch`, `fetchWithToken`, AND `authFetch` for the same listing load fallback chain
- **ListingCard** uses `fetchWithToken` for status toggle

### What to do

- Single API module with typed methods and one error class.
- One config source for `NEXT_PUBLIC_API_URL`.
- Delete `api-helpers.ts` after migrating callers.
- Optional: `listingsApi.getAll()`, `bookingsApi.create()`, etc.

---

## 4. Duplicated business rules (frontend ↔ API)

### Problem

The same domain rules are implemented in more than one place, sometimes with different algorithms.

### Duplications

| Rule | Frontend | API |
|------|----------|-----|
| Nights between dates | `src/lib/dates.ts` → `nightsBetween` | `api-server/src/routes/bookings.ts` → `nightsBetween` (different date parsing) |
| Listing type resolution | `src/lib/categories.ts` → `getListingType` | `api-server/src/utils/listingType.ts` → `enrichListing` |
| Listing type (again) | `getListingTypeAlt` in `categories.ts` | — |
| Listing type (again) | `whatListingType` in `misc-helpers.ts` | — |
| Service fee | `calculateBookingTotal` uses **12%** (`booking.ts`) | API stores **subtotal only** (no fee) — checkout total ≠ booking record |

### What to do

- Share or mirror date math intentionally (shared package or copy with tests).
- **One** `getListingType` on the frontend; delete `getListingTypeAlt` and `whatListingType`.
- Decide on service fee policy: either add fee to API total or remove from checkout display; align both sides.
- Extract `BOOKING_SERVICE_FEE_RATE = 0.12` constant.

### Known inconsistency (fix as part of this item)

Checkout shows `subtotal + 12% service fee`, but `POST /bookings` saves `price_per_night × nights` only. Trips dashboard shows the API total (without fee).

---

## 5. Fat Express route handlers

### Problem

Route files contain SQL strings, validation, authorization checks, and business rules inline.

### Files to fix

| File | Issue |
|------|--------|
| `api-server/src/routes/listings.ts` | Large Zod schemas, SQL, `enrichListing` calls, ownership checks in handlers |
| `api-server/src/routes/users.ts` | bcrypt, JWT signing, SQL inline |
| `api-server/src/routes/bookings.ts` | Overlap query, pricing, demo booking rules inline |

### Example

`GET /listings/:id` duplicates column list as inline `cols` string instead of reusing `LISTING_COLUMNS_ALIASED`.

### What to do

- `services/listingService.ts`, `services/bookingService.ts`, `services/userService.ts`
- `repositories/` or query modules for SQL
- Routes: parse request → call service → send response

---

## 6. Magic strings, numbers, and secrets

### Problem

Literals are repeated; sensitive defaults are hardcoded.

### Examples

| Location | Issue |
|----------|--------|
| `src/lib/booking.ts` | `0.12` service fee with only a comment |
| `src/context/AuthProvider.tsx` | Raw `"stayngo_token"` / `"stayngo_user"` strings alongside `auth-storage.ts` keys |
| `src/app/dashboard/page.tsx` | `listing_type === "homes"` etc. instead of shared types/helpers |
| `api-server/src/db/create-database.ts` | **Hardcoded Postgres password** in fallback connection string |
| `api-server/src/config/env.ts` | Default JWT secret for development |

### What to do

- Centralize constants in `src/lib/constants.ts` and `api-server/src/constants/`.
- Remove hardcoded DB password; require `DATABASE_URL` or `DB_PASSWORD` in env.
- Use `auth-storage` key constants everywhere (export `TOKEN_KEY`, `USER_KEY`).

---

## 7. Inconsistent error handling

### Problem

Different layers throw/catch different error types; user messages vary in quality.

### Examples

| Location | Behavior |
|----------|----------|
| `api.ts` | Throws `ApiError` with status |
| `api-helpers.ts` | Throws generic `Error` with string message |
| `checkout/page.tsx` | Handles `ApiError`, `Error`, and unknown |
| `dashboard/page.tsx` | Bookings failure sets `"bookings failed"`; listings failure sets a longer message |
| `ListingCard.tsx` | Only checks `instanceof Error` (lost `ApiError` status) |

### What to do

- Map all API failures through one client error type.
- Consistent user-facing messages per feature.
- Optional: toast or error boundary pattern.

---

## 8. Validation in the wrong layer

### Problem

Payment validation is duplicated; checkout no longer imports `payment-format.ts`.

### Files to fix

| File | Issue |
|------|--------|
| `src/app/listings/[id]/checkout/page.tsx` | Local `formatCardNumber`, `checkCardOk`, etc. at top of file |
| `src/lib/payment-format.ts` | Same functions, marked as unused duplicate |
| `src/components/host/ListingForm.tsx` vs API Zod | Client/server listing rules should stay in sync |

### What to do

- Checkout imports from `payment-format.ts` only; delete inline copies.
- Consider shared Zod schemas or code-generated types from API for listing forms.

---

## 9. Auth context does too much

### Problem

`AuthProvider` handles storage, navigation, and every auth API call. Storage is written twice on login.

### File

`src/context/AuthProvider.tsx`

### Issues

- `persistAuth` calls `setStoredAuth` **and** `localStorage.setItem` directly
- `logout` calls `clearStoredAuth` **and** manual `localStorage.removeItem`
- No error handling on `login` / `signup` (failed requests bubble uncaught to form)

### What to do

- `authService.ts` for API calls
- `auth-storage.ts` as the **only** storage touchpoint
- Provider wires state + exposes methods; forms handle errors

---

## 10. Junk-drawer modules and redundant explore filtering

### Problem

`misc-helpers.ts` mixes money formatting, gradients, nights copy, and listing type logic. Explore page adds a pointless pre-filter loop.

### Files

| File | Issue |
|------|--------|
| `src/lib/misc-helpers.ts` | Unrelated helpers in one file; overlaps `dates.ts`, `categories.ts` |
| `src/app/explore/page.tsx` | `filterListingsOnPage` loops and filters, then calls `applyFilters` anyway |
| `src/app/explore/page.tsx` | Tab **counts** use `getListingTypeAlt`; grid uses `getListingType` — inconsistent |

### What to do

- Delete `misc-helpers.ts` after moving any still-needed helpers to proper modules.
- Explore uses `applyFilters` directly once.
- Tab counts and grid both use `getListingType`.

---

## Unit testing

Vitest is configured for both the frontend and API server. Tests live next to the code they cover as `*.test.ts` files.

### Run tests

**Frontend** (from project root):

```bash
npm test
```

Watch mode while developing:

```bash
npm run test:watch
```

**API server**:

```bash
cd api-server
npm test
```

### Test layout

| Location | Config | Test files |
|----------|--------|------------|
| `src/lib/*.test.ts` | `vitest.config.ts` | Frontend pure functions |
| `api-server/src/**/*.test.ts` | `api-server/vitest.config.ts` | API pure functions |

Add new frontend tests under `src/lib/` (or `src/lib/__tests__/` if you prefer a folder). Add new API tests under `api-server/src/utils/` or next to the module being tested.

---

### Functions with tests already (starter suite)

These have basic coverage — extend them with edge cases as you refactor.

| Function | File | Test file |
|----------|------|-----------|
| `calculateBookingTotal` | `src/lib/booking.ts` | `src/lib/booking.test.ts` |
| `formatBookingSummary` | `src/lib/booking.ts` | `src/lib/booking.test.ts` |
| `nightsBetween` | `src/lib/dates.ts` | `src/lib/dates.test.ts` |
| `formatPrice` | `src/lib/dates.ts` | `src/lib/dates.test.ts` |
| `formatDateRange` | `src/lib/dates.ts` | `src/lib/dates.test.ts` |
| `categorizeBooking` | `src/lib/dates.ts` | `src/lib/dates.test.ts` |
| `formatCardNumber` | `src/lib/payment-format.ts` | `src/lib/payment-format.test.ts` |
| `formatCardExpiry` | `src/lib/payment-format.ts` | `src/lib/payment-format.test.ts` |
| `formatCardCvc` | `src/lib/payment-format.ts` | `src/lib/payment-format.test.ts` |
| `isDemoCardValid` | `src/lib/payment-format.ts` | `src/lib/payment-format.test.ts` |
| `isExpiryValid` | `src/lib/payment-format.ts` | `src/lib/payment-format.test.ts` |
| `isCvcValid` | `src/lib/payment-format.ts` | `src/lib/payment-format.test.ts` |
| `getListingType` | `src/lib/categories.ts` | `src/lib/categories.test.ts` |
| `categoryLabel` | `src/lib/categories.ts` | `src/lib/categories.test.ts` |
| `applyFilters` | `src/lib/categories.ts` | `src/lib/categories.test.ts` |
| `parseRoomCount` | `src/lib/host-form-utils.ts` | `src/lib/host-form-utils.test.ts` |
| `normalizePriceInput` | `src/lib/host-form-utils.ts` | `src/lib/host-form-utils.test.ts` |
| `nightsBetween` | `api-server/src/utils/bookingDates.ts` | `api-server/src/utils/bookingDates.test.ts` |
| `deriveListingType` | `api-server/src/utils/listingType.ts` | `api-server/src/utils/listingType.test.ts` |
| `enrichListing` | `api-server/src/utils/listingType.ts` | `api-server/src/utils/listingType.test.ts` |

---

### Functions you SHOULD add tests for

Add these as you fix related FIXME items. Tests should lock behavior before deleting duplicates or extracting modules.

#### Frontend — high priority

| Function | File | Why test |
|----------|------|----------|
| `getListingTypeAlt` | `src/lib/categories.ts` | Prove it matches `getListingType` or document differences before deleting |
| `applyFilters` | `src/lib/categories.ts` | More cases: max price, min guests, min bedrooms, subcategories, empty filters |
| `countActiveFilters` | `src/lib/categories.ts` | Filter badge count on explore panel |
| `subcategoriesForTab` | `src/lib/categories.ts` | Tab → category list mapping |
| `cardDigitCount` | `src/lib/payment-format.ts` | Used by validation helpers |
| `guestLabel` | `src/lib/host-form-utils.ts` | Singular/plural copy |
| `roomLabel` | `src/lib/host-form-utils.ts` | Zero/one/many bedroom/bathroom labels |
| `initRoomSelect` | `src/lib/host-form-utils.ts` | `8+` / `6+` custom count UI state |
| `initGuestSelect` | `src/lib/host-form-utils.ts` | Guest dropdown default for uncommon counts |
| Checkout inline helpers | `src/app/listings/[id]/checkout/page.tsx` | After consolidating to `payment-format.ts`, delete page copies and keep one test suite |

#### Frontend — after refactor / delete junk

| Function | File | Why test |
|----------|------|----------|
| `nightsBetweenCopy` | `src/lib/misc-helpers.ts` | Delete or merge with `dates.ts` — test parity first |
| `formatMoney` | `src/lib/misc-helpers.ts` | Differs from `formatPrice` — decide which to keep |
| `whatListingType` | `src/lib/misc-helpers.ts` | Duplicate listing type logic |
| `makeGradient` / `getHueForCity` | `src/lib/misc-helpers.ts` | After extracting shared placeholder component |

#### API — high priority

| Function | Area | Why test |
|----------|------|----------|
| `createBookingSchema` | `api-server/src/routes/bookings.ts` | Invalid dates, `check_out` before `check_in`, bad UUID |
| `createListingSchema` | `api-server/src/routes/listings.ts` | Homes require address, zip, home_type |
| `updateListingSchema` | `api-server/src/routes/listings.ts` | Partial updates, homes validation |
| `signupSchema` / `loginSchema` | `api-server/src/routes/users.ts` | Email/password rules |
| `calcSubtotalOnly` | `api-server/src/routes/bookings.ts` | Extract and align with frontend fee policy |

#### API — integration (second wave)

| Area | Why test |
|------|----------|
| `POST /users/signup` + `POST /users/login` | Auth flow returns JWT |
| `GET /listings` | Only active listings returned |
| `POST /bookings` | Total price, overlap conflict `409` |
| `PATCH /listings/:id/status` | Draft/active toggle |

Use **supertest** against the Express app with a mocked or test database for integration tests.

---

### Your turn — add new tests here

Use this checklist when contributing tests. Create a new `*.test.ts` file (or extend an existing one) and check items off in your PR.

- [ ] `countActiveFilters` — `src/lib/categories.test.ts`
- [ ] `subcategoriesForTab` — `src/lib/categories.test.ts`
- [ ] `getListingTypeAlt` vs `getListingType` parity — `src/lib/categories.test.ts`
- [ ] `guestLabel` and `roomLabel` — `src/lib/host-form-utils.test.ts`
- [ ] `initRoomSelect` and `initGuestSelect` — `src/lib/host-form-utils.test.ts`
- [ ] `applyFilters` edge cases (max price, guests, bedrooms) — `src/lib/categories.test.ts`
- [ ] Booking Zod schemas — `api-server/src/routes/bookings.test.ts` (new file)
- [ ] Listing Zod schemas — `api-server/src/routes/listings.test.ts` (new file)
- [ ] User Zod schemas — `api-server/src/routes/users.test.ts` (new file)
- [ ] After API refactor: service-layer booking total matches checkout display

**Tips**

- Prefer testing **pure functions** (no React, no DB) first.
- Use `vi.useFakeTimers()` for date-dependent logic (see `dates.test.ts`).
- When two functions duplicate logic (`nightsBetween` frontend vs API), write tests that document expected parity — then unify implementations until both suites pass.

---

## Suggested refactor order

1. **API layer consolidation** (#3, #7) — stops new duplication
2. **Delete duplicates** (#4, #8, #10) — quick wins
3. **Extract hooks** (#1) — improves frontend structure
4. **API services** (#5) — improves backend structure
5. **Shared UI** (#2) — polish
6. **Constants & secrets** (#6) — security hygiene
7. **Auth cleanup** (#9)
8. **Unit testing** — extend starter tests (see Unit testing section); add schema and integration tests

---

## Smoke test checklist

After refactoring, verify:

- [ ] `npm run dev` (frontend) and `cd api-server && npm run dev` (API) start without errors
- [ ] Sign up / log in / log out
- [ ] Explore loads listings; filters work; tab counts match visible results
- [ ] Create and edit a home listing; toggle draft/active
- [ ] Book a listing with test card `4242 4242 4242 4242`
- [ ] Trips tab shows the booking; totals match your fee policy
- [ ] Profile update and password change still work

---

## Files added or heavily modified on this branch

| Path | Role in exercise |
|------|------------------|
| `FIXME.md` | This guide |
| `src/lib/app-config.ts` | Duplicate API URL config |
| `src/lib/api-helpers.ts` | Second fetch wrapper |
| `src/lib/misc-helpers.ts` | Junk-drawer utilities |
| `src/lib/categories.ts` | Added `getListingTypeAlt` |
| `src/lib/payment-format.ts` | Orphaned duplicate of checkout helpers |
| `src/app/listings/[id]/checkout/page.tsx` | God component + inline payment logic |
| `src/app/explore/page.tsx` | Redundant filter + mixed fetch |
| `src/app/dashboard/page.tsx` | Split effects + inconsistent counts |
| `src/context/AuthProvider.tsx` | Double localStorage writes |
| `src/components/explore/ExploreCard.tsx` | Dual gradient paths |
| `src/components/dashboard/ListingCard.tsx` | Uses `fetchWithToken` |
| `api-server/src/routes/bookings.ts` | Duplicate nights + fee comment |
| `api-server/src/routes/listings.ts` | Inline SQL columns on `GET /:id` |
| `api-server/src/db/create-database.ts` | Hardcoded password fallback |
| `vitest.config.ts` | Frontend test runner config |
| `api-server/vitest.config.ts` | API test runner config |
| `src/lib/*.test.ts` | Starter frontend unit tests |
| `api-server/src/utils/*.test.ts` | Starter API unit tests |
| `api-server/src/utils/bookingDates.ts` | Extracted `nightsBetween` for API routes + tests |
