import { Router } from "express";
import { z } from "zod";
import { query } from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import type { Listing, ListingWithHost } from "../types/index.js";
import { enrichListing } from "../utils/listingType.js";
import { AppError } from "../utils/errors.js";
import { HOME_TYPES } from "../constants/homeTypes.js";

const router = Router();

const LISTING_COLUMNS = `id, host_id, title, description, city, country, address, address_line_2, zip_code, home_type,
  price_per_night, max_guests, bedrooms, bathrooms, category, is_active, created_at`;

const LISTING_COLUMNS_ALIASED = `l.id, l.host_id, l.title, l.description, l.city, l.country, l.address, l.address_line_2, l.zip_code, l.home_type,
  l.price_per_night, l.max_guests, l.bedrooms, l.bathrooms, l.category, l.is_active, l.created_at`;

const addressFieldsSchema = {
  address: z.string().min(1).max(255).optional(),
  address_line_2: z.string().max(255).optional().nullable(),
  zip_code: z.string().min(2).max(20).optional(),
};

const createListingSchema = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().min(10),
    city: z.string().min(1).max(120),
    country: z.string().min(1).max(120),
    ...addressFieldsSchema,
    home_type: z.enum(HOME_TYPES).optional(),
    price_per_night: z.number().positive(),
    max_guests: z.number().int().positive(),
    bedrooms: z.number().int().min(0).default(0),
    bathrooms: z.number().int().min(0).default(0),
    listing_type: z.enum(["homes", "services", "experiences"]),
    category: z.string().min(1).max(40),
  })
  .refine(
    (data) => data.listing_type !== "homes" || data.category === "homes",
    { message: "Homes must use category 'homes'", path: ["category"] }
  )
  .refine(
    (data) => data.listing_type !== "homes" || !!data.address?.trim(),
    { message: "Street address is required for homes", path: ["address"] }
  )
  .refine(
    (data) => data.listing_type !== "homes" || !!data.zip_code?.trim(),
    { message: "ZIP code is required for homes", path: ["zip_code"] }
  )
  .refine(
    (data) => data.listing_type !== "homes" || !!data.home_type,
    { message: "Home type is required for homes", path: ["home_type"] }
  );

const updateListingSchema = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().min(10),
    city: z.string().min(1).max(120),
    country: z.string().min(1).max(120),
    address: z.string().min(1).max(255).optional().nullable(),
    address_line_2: z.string().max(255).optional().nullable(),
    zip_code: z.string().min(2).max(20).optional().nullable(),
    home_type: z.enum(HOME_TYPES).optional().nullable(),
    price_per_night: z.number().positive(),
    max_guests: z.number().int().positive(),
    bedrooms: z.number().int().min(0).default(0),
    bathrooms: z.number().int().min(0).default(0),
    category: z.string().min(1).max(40),
  })
  .refine(
    (data) =>
      (data.category !== "homes" && data.category !== "stays") ||
      !!data.address?.trim(),
    { message: "Street address is required for homes", path: ["address"] }
  )
  .refine(
    (data) =>
      (data.category !== "homes" && data.category !== "stays") ||
      !!data.zip_code?.trim(),
    { message: "ZIP code is required for homes", path: ["zip_code"] }
  )
  .refine(
    (data) =>
      (data.category !== "homes" && data.category !== "stays") || !!data.home_type,
    { message: "Home type is required for homes", path: ["home_type"] }
  );

function isHomeListing(category: string, listingType?: string): boolean {
  return listingType === "homes" || category === "homes" || category === "stays";
}

router.use(requireDatabase);

router.get("/", async (_req, res, next) => {
  try {
    const result = await query<ListingWithHost>(
      `SELECT ${LISTING_COLUMNS_ALIASED}, u.name AS host_name
       FROM listings l
       JOIN users u ON u.id = l.host_id
       WHERE l.is_active = TRUE
       ORDER BY l.created_at DESC`
    );

    res.json({ listings: result.rows.map(enrichListing) });
  } catch (error) {
    next(error);
  }
});

router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const result = await query<Listing>(
      `SELECT ${LISTING_COLUMNS}
       FROM listings
       WHERE host_id = $1
       ORDER BY created_at DESC`,
      [req.user!.userId]
    );

    res.json({ listings: result.rows.map(enrichListing) });
  } catch (error) {
    next(error);
  }
});

router.get("/mine/:id", requireAuth, async (req, res, next) => {
  try {
    const result = await query<Listing>(
      `SELECT ${LISTING_COLUMNS}
       FROM listings
       WHERE id = $1 AND host_id = $2`,
      [req.params.id, req.user!.userId]
    );

    const listing = result.rows[0];
    if (!listing) {
      throw new AppError(404, "Listing not found");
    }

    res.json({ listing: enrichListing(listing) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = await query<ListingWithHost>(
      `SELECT ${LISTING_COLUMNS_ALIASED}, u.name AS host_name
       FROM listings l
       JOIN users u ON u.id = l.host_id
       WHERE l.id = $1 AND l.is_active = TRUE`,
      [req.params.id]
    );

    const listing = result.rows[0];
    if (!listing) {
      throw new AppError(404, "Listing not found");
    }

    res.json({ listing: enrichListing(listing) });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const body = createListingSchema.parse(req.body);

    const result = await query<Listing>(
      `INSERT INTO listings (
         host_id, title, description, city, country, address, address_line_2, zip_code, home_type,
         price_per_night, max_guests, bedrooms, bathrooms, category, listing_type
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING ${LISTING_COLUMNS}`,
      [
        req.user!.userId,
        body.title,
        body.description,
        body.city,
        body.country,
        body.address?.trim() ?? null,
        body.address_line_2?.trim() || null,
        body.zip_code?.trim() ?? null,
        body.home_type ?? null,
        body.price_per_night,
        body.max_guests,
        body.bedrooms,
        body.bathrooms,
        body.category,
        body.listing_type,
      ]
    );

    res.status(201).json({ listing: enrichListing(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    const body = z.object({ is_active: z.boolean() }).parse(req.body);

    const result = await query<Listing>(
      `UPDATE listings
       SET is_active = $3, updated_at = NOW()
       WHERE id = $1 AND host_id = $2
       RETURNING ${LISTING_COLUMNS}`,
      [req.params.id, req.user!.userId, body.is_active]
    );

    const listing = result.rows[0];
    if (!listing) {
      throw new AppError(404, "Listing not found");
    }

    res.json({ listing: enrichListing(listing) });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const existing = await query<Listing>(
      `SELECT ${LISTING_COLUMNS} FROM listings WHERE id = $1 AND host_id = $2`,
      [req.params.id, req.user!.userId]
    );

    const listing = existing.rows[0];
    if (!listing) {
      throw new AppError(404, "Listing not found");
    }

    const body = updateListingSchema.parse(req.body);
    const enriched = enrichListing(listing);
    const isHome = isHomeListing(body.category, enriched.listing_type);

    if (isHome && body.category !== "homes") {
      throw new AppError(400, "Homes must use category 'homes'");
    }

    const result = await query<Listing>(
      `UPDATE listings
       SET
         title = $3,
         description = $4,
         city = $5,
         country = $6,
         address = $7,
         address_line_2 = $8,
         zip_code = $9,
         home_type = $10,
         price_per_night = $11,
         max_guests = $12,
         bedrooms = $13,
         bathrooms = $14,
         category = $15,
         updated_at = NOW()
       WHERE id = $1 AND host_id = $2
       RETURNING ${LISTING_COLUMNS}`,
      [
        req.params.id,
        req.user!.userId,
        body.title,
        body.description,
        body.city,
        body.country,
        isHome ? body.address?.trim() ?? null : null,
        isHome ? body.address_line_2?.trim() || null : null,
        isHome ? body.zip_code?.trim() ?? null : null,
        isHome ? body.home_type ?? null : null,
        body.price_per_night,
        body.max_guests,
        isHome ? body.bedrooms : 0,
        isHome ? body.bathrooms : 0,
        isHome ? "homes" : body.category,
      ]
    );

    res.json({ listing: enrichListing(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

export default router;
