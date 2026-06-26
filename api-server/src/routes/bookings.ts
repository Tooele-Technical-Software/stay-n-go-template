import { Router } from "express";
import { z } from "zod";
import { query } from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import type { BookingWithDetails, Listing } from "../types/index.js";
import { AppError } from "../utils/errors.js";

const router = Router();

const createBookingSchema = z
  .object({
    listing_id: z.string().uuid(),
    check_in: z.string().date(),
    check_out: z.string().date(),
  })
  .refine((data) => data.check_out > data.check_in, {
    message: "check_out must be after check_in",
    path: ["check_out"],
  });

function nightsBetween(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end.getTime() - start.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

router.use(requireDatabase);
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const result = await query<BookingWithDetails>(
      `SELECT b.id, b.listing_id, b.guest_id, b.check_in, b.check_out,
              b.total_price, b.status, b.created_at,
              l.title AS listing_title, l.city, l.country,
              u.name AS guest_name
       FROM bookings b
       JOIN listings l ON l.id = b.listing_id
       JOIN users u ON u.id = b.guest_id
       WHERE b.guest_id = $1
       ORDER BY b.created_at DESC`,
      [req.user!.userId]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = await query<BookingWithDetails>(
      `SELECT b.id, b.listing_id, b.guest_id, b.check_in, b.check_out,
              b.total_price, b.status, b.created_at,
              l.title AS listing_title, l.city, l.country,
              u.name AS guest_name
       FROM bookings b
       JOIN listings l ON l.id = b.listing_id
       JOIN users u ON u.id = b.guest_id
       WHERE b.id = $1 AND b.guest_id = $2`,
      [req.params.id, req.user!.userId]
    );

    const booking = result.rows[0];
    if (!booking) {
      throw new AppError(404, "Booking not found");
    }

    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = createBookingSchema.parse(req.body);

    const listingResult = await query<Listing>(
      `SELECT id, host_id, price_per_night, max_guests, is_active
       FROM listings
       WHERE id = $1`,
      [body.listing_id]
    );

    const listing = listingResult.rows[0];
    if (!listing) {
      throw new AppError(404, "Listing not found");
    }

    // Demo: allow booking own listings and draft/inactive listings for testing.

    const nights = nightsBetween(body.check_in, body.check_out);
    if (nights < 1) {
      throw new AppError(400, "Booking must be at least one night");
    }

    const overlap = await query(
      `SELECT id FROM bookings
       WHERE listing_id = $1
         AND status != 'cancelled'
         AND check_in < $3
         AND check_out > $2`,
      [body.listing_id, body.check_in, body.check_out]
    );

    if (overlap.rows.length > 0) {
      throw new AppError(409, "Listing is not available for those dates");
    }

    const pricePerNight = parseFloat(listing.price_per_night);
    const totalPrice = pricePerNight * nights;

    const result = await query(
      `INSERT INTO bookings (listing_id, guest_id, check_in, check_out, total_price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, listing_id, guest_id, check_in, check_out, total_price, status, created_at`,
      [
        body.listing_id,
        req.user!.userId,
        body.check_in,
        body.check_out,
        totalPrice,
      ]
    );

    res.status(201).json({ booking: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
