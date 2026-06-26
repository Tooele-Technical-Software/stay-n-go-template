export const HOME_TYPES = [
  "house",
  "apartment",
  "condo",
  "townhouse",
  "cabin",
  "villa",
  "loft",
  "cottage",
  "guesthouse",
  "other",
] as const;

export type HomeType = (typeof HOME_TYPES)[number];
