# TESTER — How to Build Unit Tests

This guide is for students on the **`broken`** branch. Use it with [`FIXME.md`](FIXME.md) (what to fix) while you refactor. It explains **how to write tests**, **where test files go**, and **which functions still need coverage**.

---

## Table of contents

1. [What you are testing](#1-what-you-are-testing)
2. [Run the test suite](#2-run-the-test-suite)
3. [Where test files live](#3-where-test-files-live)
4. [How to write a test](#4-how-to-write-a-test)
5. [Starter tests (read these first)](#5-starter-tests-read-these-first)
6. [Functions that need tests](#6-functions-that-need-tests)
7. [Patterns by test type](#7-patterns-by-test-type)
8. [Tests to add as you refactor](#8-tests-to-add-as-you-refactor)
9. [Checklist](#9-checklist)

---

## 1. What you are testing

Stay N Go uses **[Vitest](https://vitest.dev/)** for unit tests. Focus on **pure functions** — logic with clear inputs and outputs, no UI and no database.

| Good candidates | Examples |
|-----------------|----------|
| Math / pricing | `calculateBookingTotal`, `nightsBetween` |
| Formatting | `formatPrice`, `formatCardNumber` |
| Filtering | `applyFilters`, `countActiveFilters` |
| Validation | `isExpiryValid`, Zod schemas on the API |
| Classification | `getListingType`, `deriveListingType` |

| Save for later | Why |
|----------------|-----|
| React components | Need React Testing Library |
| Express routes with DB | Need supertest + test database |
| `fetch` / API services | Need mocks |

---

## 2. Run the test suite

### Frontend (from project root)

```bash
npm install
npm test
```

Watch mode (re-runs on save):

```bash
npm run test:watch
```

### API server

```bash
cd api-server
npm install
npm test
```

### Before you submit work

```bash
npm test && cd api-server && npm test
```

Both commands should report **all tests passing**.

---

## 3. Where test files live

| Package | Config | Pattern |
|---------|--------|---------|
| Frontend | `vitest.config.ts` | `src/**/*.test.ts` |
| API | `api-server/vitest.config.ts` | `api-server/src/**/*.test.ts` |

**Rule:** put `moduleName.test.ts` **next to** `moduleName.ts`.

```
src/lib/
  booking.ts
  booking.test.ts    ← tests for booking.ts
  dates.ts
  dates.test.ts
```

---

## 4. How to write a test

### Minimal template

Create or open a `*.test.ts` file and use this structure:

```ts
import { describe, expect, it } from "vitest";
import { myFunction } from "./myModule";

describe("myFunction", () => {
  it("does the expected thing for a normal input", () => {
    expect(myFunction("input")).toBe("expected");
  });

  it("handles an edge case", () => {
    expect(myFunction("")).toBe("");
  });
});
```

### Building blocks

| Piece | Purpose |
|-------|---------|
| `describe("name")` | Groups related tests |
| `it("description")` | One behavior / one case |
| `expect(value).toBe(x)` | Strict equality |
| `expect(value).toEqual(x)` | Deep equality (objects, arrays) |
| `expect(() => fn()).toThrow()` | Should throw an error |

### Workflow

1. Pick a function from [Section 6](#6-functions-that-need-tests).
2. Open its **existing** test file or create `functionFile.test.ts`.
3. Add a `describe` block for that function.
4. Write at least **two** `it` blocks: happy path + edge case.
5. Run `npm test` until green.
6. Refactor code if needed — tests should still pass.

---

## 5. Starter tests (read these first)

The `broken` branch already includes example tests. **Read them before writing your own.**

| Test file | What to learn from it |
|-----------|----------------------|
| `src/lib/booking.test.ts` | Testing return objects (nights, fees, totals) |
| `src/lib/dates.test.ts` | `vi.useFakeTimers()` for date-dependent logic |
| `src/lib/payment-format.test.ts` | String formatting and validation booleans |
| `src/lib/categories.test.ts` | Helper `makeListing()` + filter assertions |
| `src/lib/host-form-utils.test.ts` | Parsing and normalizing user input |
| `api-server/src/utils/bookingDates.test.ts` | API date math |
| `api-server/src/utils/listingType.test.ts` | Category → type mapping |

**Current counts:** ~24 frontend tests, ~5 API tests (run `npm test` in each package to confirm).

---

## 6. Functions that need tests

### Already covered (extend, do not delete)

| Function | Source file | Test file |
|----------|-------------|-----------|
| `calculateBookingTotal` | `src/lib/booking.ts` | `booking.test.ts` |
| `formatBookingSummary` | `src/lib/booking.ts` | `booking.test.ts` |
| `nightsBetween` | `src/lib/dates.ts` | `dates.test.ts` |
| `formatPrice` | `src/lib/dates.ts` | `dates.test.ts` |
| `formatDateRange` | `src/lib/dates.ts` | `dates.test.ts` |
| `categorizeBooking` | `src/lib/dates.ts` | `dates.test.ts` |
| `formatCardNumber` | `src/lib/payment-format.ts` | `payment-format.test.ts` |
| `formatCardExpiry` | `src/lib/payment-format.ts` | `payment-format.test.ts` |
| `formatCardCvc` | `src/lib/payment-format.ts` | `payment-format.test.ts` |
| `isDemoCardValid` | `src/lib/payment-format.ts` | `payment-format.test.ts` |
| `isExpiryValid` | `src/lib/payment-format.ts` | `payment-format.test.ts` |
| `isCvcValid` | `src/lib/payment-format.ts` | `payment-format.test.ts` |
| `getListingType` | `src/lib/categories.ts` | `categories.test.ts` |
| `categoryLabel` | `src/lib/categories.ts` | `categories.test.ts` |
| `applyFilters` | `src/lib/categories.ts` | `categories.test.ts` |
| `parseRoomCount` | `src/lib/host-form-utils.ts` | `host-form-utils.test.ts` |
| `normalizePriceInput` | `src/lib/host-form-utils.ts` | `host-form-utils.test.ts` |
| `nightsBetween` | `api-server/src/utils/bookingDates.ts` | `bookingDates.test.ts` |
| `deriveListingType` | `api-server/src/utils/listingType.ts` | `listingType.test.ts` |
| `enrichListing` | `api-server/src/utils/listingType.ts` | `listingType.test.ts` |

---

### You must add tests for

#### Frontend — `src/lib/`

| Function | Source file | Add tests in |
|----------|-------------|--------------|
| `countActiveFilters` | `categories.ts` | `categories.test.ts` |
| `subcategoriesForTab` | `categories.ts` | `categories.test.ts` |
| `applyFilters` (more cases) | `categories.ts` | `categories.test.ts` |
| `getListingTypeAlt` vs `getListingType` | `categories.ts` | `categories.test.ts` |
| `cardDigitCount` | `payment-format.ts` | `payment-format.test.ts` |
| `guestLabel` | `host-form-utils.ts` | `host-form-utils.test.ts` |
| `roomLabel` | `host-form-utils.ts` | `host-form-utils.test.ts` |
| `initRoomSelect` | `host-form-utils.ts` | `host-form-utils.test.ts` |
| `initGuestSelect` | `host-form-utils.ts` | `host-form-utils.test.ts` |

#### Frontend — after you extract new modules

| Function / module | Create test file |
|-------------------|------------------|
| `getErrorMessage` | `errors.test.ts` |
| `listingPlaceholderGradient` | `listing-placeholder.test.ts` |
| `src/lib/services/listings.ts` | `services/listings.test.ts` (optional) |
| `src/lib/services/bookings.ts` | `services/bookings.test.ts` (optional) |

#### API — `api-server/src/`

| Function / schema | Source | Create test file |
|-------------------|--------|------------------|
| `calculateBookingTotal` | `utils/bookingPricing.ts` | `bookingPricing.test.ts` |
| `nightsBetween` parity with frontend | `utils/bookingDates.ts` | `bookingDates.test.ts` |
| `createBookingSchema` | `routes/bookings.ts` | `routes/bookings.schema.test.ts` |
| `createListingSchema` | `routes/listings.ts` | `routes/listings.schema.test.ts` |
| `updateListingSchema` | `routes/listings.ts` | `routes/listings.schema.test.ts` |
| `signupSchema` | `routes/users.ts` | `routes/users.schema.test.ts` |
| `loginSchema` | `routes/users.ts` | `routes/users.schema.test.ts` |
| Booking service logic | `services/bookingService.ts` | `services/bookingService.test.ts` |

#### Cross-cutting (after refactor)

| Assertion | Why |
|-----------|-----|
| Frontend `calculateBookingTotal` === API `calculateBookingTotal` | Checkout and trips must agree |
| Same `nightsBetween` results on both sides | Booking length must match |

---

## 7. Patterns by test type

### A. Return value / calculation

Look at `booking.test.ts`. Test nights, subtotal, fee, and total for known dates and prices.

**Think about:** one night vs many nights, string price vs number price.

---

### B. String formatting

Look at `payment-format.test.ts`. Call the formatter, assert the output string.

**Think about:** digits only, max length, auto-inserted spaces or slashes.

---

### C. Filters and booleans

Look at `categories.test.ts`. Build a small array of fake listings (use the existing `makeListing` helper), run `applyFilters`, assert which IDs remain.

**Think about:** empty filters, min/max price, guest count, wrong tab type.

---

### D. Dates and “today”

Look at `dates.test.ts` → `categorizeBooking`. Use fake timers:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.useRealTimers();
});

it("marks past trips correctly", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-07-01T12:00:00"));
  // ... call categorizeBooking and assert "past" or "upcoming"
});
```

---

### E. Zod schemas (API)

1. **Export** the schema from the route file, e.g. `export { createBookingSchema };`
2. Create `routes/bookings.schema.test.ts`
3. Test **valid** payload with `.parse()` — should not throw
4. Test **invalid** payload with `expect(() => schema.parse(bad)).toThrow()`

**Cases to cover:** bad UUID, reversed dates, missing required home fields, short password.

---

### F. Parity between frontend and API

When two files implement the same rule (`nightsBetween`, `calculateBookingTotal`), use **identical test cases** in both packages:

```ts
const cases = [
  ["2026-07-01", "2026-07-05", 4],
  ["2026-07-01", "2026-07-02", 1],
] as const;

it.each(cases)("%s → %s = %i nights", (checkIn, checkOut, expected) => {
  expect(nightsBetween(checkIn, checkOut)).toBe(expected);
});
```

---

## 8. Tests to add as you refactor

Match tests to [`FIXME.md`](FIXME.md) items:

| FIXME area | Testing focus |
|------------|---------------|
| Duplicated business rules | Parity tests for nights + booking totals |
| Validation layer | `payment-format.ts` only; remove duplicate checkout helpers |
| Junk drawer / explore | Delete `getListingTypeAlt` after parity test proves it is redundant |
| Error handling | `getErrorMessage` handles `ApiError`, `Error`, unknown |
| UI placeholders | `listingPlaceholderGradient` returns a CSS gradient string |
| Fat API routes | Schema tests + booking service total includes service fee |

Run `npm test` after **each** refactor section, not only at the end.

---

## 9. Checklist

### Extend existing test files

- [ ] `countActiveFilters` → `src/lib/categories.test.ts`
- [ ] `subcategoriesForTab` → `src/lib/categories.test.ts`
- [ ] More `applyFilters` cases → `src/lib/categories.test.ts`
- [ ] `getListingTypeAlt` parity → `src/lib/categories.test.ts`
- [ ] `guestLabel`, `roomLabel` → `src/lib/host-form-utils.test.ts`
- [ ] `initRoomSelect`, `initGuestSelect` → `src/lib/host-form-utils.test.ts`
- [ ] `cardDigitCount` → `src/lib/payment-format.test.ts`
- [ ] `nightsBetween` parity → `dates.test.ts` + `bookingDates.test.ts`

### Create new test files

- [ ] `api-server/src/utils/bookingPricing.test.ts`
- [ ] `api-server/src/routes/bookings.schema.test.ts`
- [ ] `api-server/src/routes/listings.schema.test.ts`
- [ ] `api-server/src/routes/users.schema.test.ts`
- [ ] `src/lib/errors.test.ts`
- [ ] `src/lib/listing-placeholder.test.ts`

### Final

- [ ] `npm test` passes (frontend)
- [ ] `cd api-server && npm test` passes (API)
- [ ] Checkout total matches trip total in the app

---

## Stretch goal — integration tests

Optional. Install `supertest` in `api-server`, export the Express `app` from `index.ts`, and test:

- `GET /health`
- `POST /users/signup` returns a token
- `GET /listings` returns only active listings
- `POST /bookings` returns correct total or `409` on overlap

Pure function tests above are **required** for the assignment. Integration tests are **bonus**.

---

## Related docs

- [`FIXME.md`](FIXME.md) — code problems to fix on the `broken` branch
- [`README.md`](README.md) — clone, install, and run the app
