// FIXME: consolidate with src/lib/api.ts — API base URL is defined in two places
export const API_BASE = "http://localhost:4000";
export const API_BASE_FROM_ENV =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
