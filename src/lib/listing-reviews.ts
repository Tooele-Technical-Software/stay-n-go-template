import type { Listing } from "@/types/listing";

export interface RatingCategory {
  name: string;
  score: number;
}

export interface Review {
  name: string;
  date: string;
  text: string;
  rating: number;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function scoreFromHash(hash: number, offset: number): number {
  const raw = 4.65 + ((hash + offset * 17) % 35) / 100;
  return Math.round(raw * 100) / 100;
}

export function getListingRatings(listing: Listing): {
  overall: number;
  count: number;
  categories: RatingCategory[];
} {
  const hash = hashString(listing.id);
  const categories: RatingCategory[] = [
    { name: "Cleanliness", score: scoreFromHash(hash, 1) },
    { name: "Accuracy", score: scoreFromHash(hash, 2) },
    { name: "Check-in", score: scoreFromHash(hash, 3) },
    { name: "Communication", score: scoreFromHash(hash, 4) },
    { name: "Location", score: scoreFromHash(hash, 5) },
    { name: "Value", score: scoreFromHash(hash, 6) },
  ];
  const overall =
    Math.round(
      (categories.reduce((sum, c) => sum + c.score, 0) / categories.length) * 100
    ) / 100;
  const count = 48 + (hash % 180);

  return { overall, count, categories };
}

export function getListingReviews(listing: Listing): Review[] {
  return [
    {
      name: "Sarah M.",
      date: "March 2026",
      text: `Absolutely loved our stay at ${listing.title}. Clean, cozy, and exactly as described. Would book again without hesitation!`,
      rating: 5,
    },
    {
      name: "James T.",
      date: "February 2026",
      text: "Great location and the host was very responsive. Check-in was seamless and the place was spotless when we arrived.",
      rating: 5,
    },
    {
      name: "Emily R.",
      date: "January 2026",
      text: "Beautiful space with thoughtful touches throughout. The photos don't do it justice — even better in person.",
      rating: 5,
    },
    {
      name: "Michael K.",
      date: "December 2025",
      text: `Perfect for our weekend in ${listing.city}. Quiet area, comfortable setup, and everything we needed was provided.`,
      rating: 4,
    },
    {
      name: "Priya S.",
      date: "November 2025",
      text: "Host went above and beyond with local recommendations. Communication was fast and check-in instructions were crystal clear.",
      rating: 5,
    },
    {
      name: "David L.",
      date: "October 2025",
      text: "Solid value for the price. A few minor wear-and-tear items but nothing that affected our stay. Would recommend to friends.",
      rating: 4,
    },
  ];
}
