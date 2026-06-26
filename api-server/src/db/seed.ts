import "dotenv/config";
import bcrypt from "bcryptjs";
import { closePool, getPool } from "../config/database.js";
import { env } from "../config/env.js";

const SEED_HOST = {
  email: "seed-host@stayngo.com",
  password: "seedpass123",
  name: "Stay N Go Host",
};

type SeedListing = {
  title: string;
  description: string;
  city: string;
  country: string;
  address?: string;
  address_line_2?: string;
  zip_code?: string;
  home_type?: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  category: string;
  listing_type: "homes" | "services" | "experiences";
};

const listings: SeedListing[] = [
  {
    title: "Cozy Downtown Apartment",
    description:
      "Bright one-bedroom in the heart of downtown with skyline views, fast WiFi, and a fully stocked kitchen.",
    city: "Austin",
    country: "USA",
    address: "214 Congress Ave",
    address_line_2: "Unit 12",
    zip_code: "78701",
    home_type: "apartment",
    price_per_night: 120,
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    category: "homes",
    listing_type: "homes",
  },
  {
    title: "Beachfront Bungalow",
    description:
      "Steps from the sand with a private patio, outdoor shower, and sunrise views over the ocean.",
    city: "San Diego",
    country: "USA",
    address: "880 Ocean View Dr",
    zip_code: "92109",
    home_type: "house",
    price_per_night: 245,
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    category: "homes",
    listing_type: "homes",
  },
  {
    title: "Mountain Cabin Retreat",
    description:
      "Rustic cedar cabin surrounded by pines. Fireplace, hot tub, and hiking trails right out the door.",
    city: "Denver",
    country: "USA",
    price_per_night: 185,
    max_guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    category: "homes",
    listing_type: "homes",
  },
  {
    title: "Modern Loft in Brooklyn",
    description:
      "Industrial-chic loft with exposed brick, floor-to-ceiling windows, and walkable access to cafes and galleries.",
    city: "New York",
    country: "USA",
    price_per_night: 210,
    max_guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    category: "homes",
    listing_type: "homes",
  },
  {
    title: "Lakehouse with Dock",
    description:
      "Spacious lakefront home with private dock, kayaks included, and a screened porch perfect for summer evenings.",
    city: "Minneapolis",
    country: "USA",
    price_per_night: 275,
    max_guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    category: "homes",
    listing_type: "homes",
  },
  {
    title: "Desert Adobe Villa",
    description:
      "Sun-washed adobe home with pool, cactus garden, and panoramic desert views. Ideal for a peaceful getaway.",
    city: "Phoenix",
    country: "USA",
    price_per_night: 195,
    max_guests: 5,
    bedrooms: 2,
    bathrooms: 2,
    category: "homes",
    listing_type: "homes",
  },
  {
    title: "Historic Charleston Townhouse",
    description:
      "Elegant two-story townhouse with original hardwood floors, a private courtyard, and southern charm throughout.",
    city: "Charleston",
    country: "USA",
    price_per_night: 230,
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    category: "homes",
    listing_type: "homes",
  },
  {
    title: "Charming Nashville Guest Suite",
    description:
      "Private suite above a historic home, walking distance to live music. Coffee bar and record player included.",
    city: "Nashville",
    country: "USA",
    price_per_night: 140,
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    category: "homes",
    listing_type: "homes",
  },
  {
    title: "Private Chef Experience",
    description:
      "A local chef shops, cooks, and serves a multi-course dinner in your rental. Perfect for anniversaries and celebrations.",
    city: "Austin",
    country: "USA",
    price_per_night: 150,
    max_guests: 8,
    bedrooms: 0,
    bathrooms: 0,
    category: "chef",
    listing_type: "services",
  },
  {
    title: "In-Home Spa & Massage",
    description:
      "Licensed massage therapist comes to you with oils, linens, and a calming setup. 60 or 90 minute sessions available.",
    city: "San Diego",
    country: "USA",
    price_per_night: 95,
    max_guests: 2,
    bedrooms: 0,
    bathrooms: 0,
    category: "spa",
    listing_type: "services",
  },
  {
    title: "Professional Home Cleaning",
    description:
      "Deep clean before check-in or mid-stay refresh. Eco-friendly products, linens changed, and kitchen sanitized.",
    city: "Denver",
    country: "USA",
    price_per_night: 75,
    max_guests: 1,
    bedrooms: 0,
    bathrooms: 0,
    category: "cleaning",
    listing_type: "services",
  },
  {
    title: "Vacation Photography Session",
    description:
      "Capture your trip with a professional photographer. One-hour session at your stay or a scenic local spot.",
    city: "New York",
    country: "USA",
    price_per_night: 125,
    max_guests: 6,
    bedrooms: 0,
    bathrooms: 0,
    category: "photography",
    listing_type: "services",
  },
  {
    title: "Pet Sitting & Walks",
    description:
      "Trusted sitter feeds, walks, and keeps your pet company while you're out exploring. Daily photo updates included.",
    city: "Minneapolis",
    country: "USA",
    price_per_night: 45,
    max_guests: 3,
    bedrooms: 0,
    bathrooms: 0,
    category: "pets",
    listing_type: "services",
  },
  {
    title: "Personal Training Session",
    description:
      "Certified trainer meets you at your rental or a nearby park for a custom workout. Equipment provided.",
    city: "Phoenix",
    country: "USA",
    price_per_night: 65,
    max_guests: 2,
    bedrooms: 0,
    bathrooms: 0,
    category: "wellness",
    listing_type: "services",
  },
  {
    title: "Grocery Pre-Stocking",
    description:
      "Arrive to a fridge full of essentials and local favorites. Tell us your preferences and we handle the rest.",
    city: "Charleston",
    country: "USA",
    price_per_night: 55,
    max_guests: 1,
    bedrooms: 0,
    bathrooms: 0,
    category: "catering",
    listing_type: "services",
  },
  {
    title: "Austin Food Truck Tour",
    description:
      "Sample the best tacos, BBQ, and local bites across three iconic food trucks with a knowledgeable guide.",
    city: "Austin",
    country: "USA",
    price_per_night: 65,
    max_guests: 10,
    bedrooms: 0,
    bathrooms: 0,
    category: "food_tour",
    listing_type: "experiences",
  },
  {
    title: "Rocky Mountain Sunrise Hike",
    description:
      "Guided 4-mile morning hike through alpine meadows with breathtaking summit views. All skill levels welcome.",
    city: "Denver",
    country: "USA",
    price_per_night: 55,
    max_guests: 8,
    bedrooms: 0,
    bathrooms: 0,
    category: "hiking",
    listing_type: "experiences",
  },
  {
    title: "Napa Valley Wine Tasting",
    description:
      "Visit three boutique wineries with transport included. Learn tasting techniques from a certified sommelier.",
    city: "San Diego",
    country: "USA",
    price_per_night: 120,
    max_guests: 6,
    bedrooms: 0,
    bathrooms: 0,
    category: "wine_tasting",
    listing_type: "experiences",
  },
  {
    title: "Pacific Surf Lesson",
    description:
      "Two-hour beginner surf lesson on a gentle break. Board, wetsuit, and instructor included.",
    city: "San Diego",
    country: "USA",
    price_per_night: 85,
    max_guests: 4,
    bedrooms: 0,
    bathrooms: 0,
    category: "surf_lesson",
    listing_type: "experiences",
  },
  {
    title: "Brooklyn Street Art Walk",
    description:
      "Explore hidden murals and graffiti culture in Bushwick with a local artist. Includes sketchbook and markers.",
    city: "New York",
    country: "USA",
    price_per_night: 45,
    max_guests: 12,
    bedrooms: 0,
    bathrooms: 0,
    category: "art_class",
    listing_type: "experiences",
  },
  {
    title: "Nashville Songwriter Round",
    description:
      "Intimate evening with three local songwriters performing original music in a cozy listening room.",
    city: "Nashville",
    country: "USA",
    price_per_night: 40,
    max_guests: 20,
    bedrooms: 0,
    bathrooms: 0,
    category: "live_music",
    listing_type: "experiences",
  },
];

async function seed(): Promise<void> {
  if (!env.dbEnabled) {
    console.error("DB_ENABLED is false. Enable the database before seeding.");
    process.exit(1);
  }

  const pool = getPool();
  const passwordHash = await bcrypt.hash(SEED_HOST.password, 12);

  let hostId: string;

  const existingHost = await pool.query<{ id: string }>(
    "SELECT id FROM users WHERE email = $1",
    [SEED_HOST.email]
  );

  if (existingHost.rows[0]) {
    hostId = existingHost.rows[0].id;
    console.log("Using existing seed host");
  } else {
    const hostResult = await pool.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3) RETURNING id`,
      [SEED_HOST.email, passwordHash, SEED_HOST.name]
    );
    hostId = hostResult.rows[0].id;
    console.log("Created seed host");
  }

  let inserted = 0;
  let skipped = 0;

  for (const listing of listings) {
    const exists = await pool.query(
      "SELECT id FROM listings WHERE title = $1 AND host_id = $2",
      [listing.title, hostId]
    );

    if (exists.rows.length > 0) {
      skipped++;
      continue;
    }

    await pool.query(
      `INSERT INTO listings (
         host_id, title, description, city, country, address, address_line_2, zip_code, home_type,
         price_per_night, max_guests, bedrooms, bathrooms, category, listing_type
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        hostId,
        listing.title,
        listing.description,
        listing.city,
        listing.country,
        listing.address ?? null,
        listing.address_line_2 ?? null,
        listing.zip_code ?? null,
        listing.home_type ?? null,
        listing.price_per_night,
        listing.max_guests,
        listing.bedrooms,
        listing.bathrooms,
        listing.category,
        listing.listing_type,
      ]
    );
    inserted++;
  }

  console.log(`Seed complete: ${inserted} inserted, ${skipped} skipped.`);
  await closePool();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
