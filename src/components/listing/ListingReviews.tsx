import type { Listing } from "@/types/listing";
import {
  getListingRatings,
  getListingReviews,
  type RatingCategory,
} from "@/lib/listing-reviews";

function RatingBar({ score }: { score: number }) {
  const pct = (score / 5) * 100;
  return (
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-input-border">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function CategoryRow({ category }: { category: RatingCategory }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-foreground/80">{category.name}</span>
      <RatingBar score={category.score} />
      <span className="w-8 shrink-0 text-right text-sm font-medium text-foreground">
        {category.score.toFixed(1)}
      </span>
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "text-primary" : "text-input-border"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
    </div>
  );
}

export default function ListingReviews({ listing }: { listing: Listing }) {
  const { overall, count, categories } = getListingRatings(listing);
  const reviews = getListingReviews(listing);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-16">
        <div className="flex items-center gap-3 text-primary">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
          </svg>
          <div>
            <p className="text-2xl font-semibold text-foreground">{overall.toFixed(2)}</p>
            <p className="text-sm text-muted">{count} reviews</p>
          </div>
        </div>

        <div className="grid flex-1 gap-3 sm:max-w-md">
          {categories.map((category) => (
            <CategoryRow key={category.name} category={category} />
          ))}
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {reviews.map((review) => (
          <div key={`${review.name}-${review.date}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-foreground/80">
                {review.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{review.name}</p>
                <p className="text-xs text-muted">{review.date}</p>
              </div>
            </div>
            <div className="mt-2">
              <StarRow rating={review.rating} />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{review.text}</p>
          </div>
        ))}
      </div>

      <button className="mt-8 rounded-lg border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-accent">
        Show all {count} reviews
      </button>
    </section>
  );
}
