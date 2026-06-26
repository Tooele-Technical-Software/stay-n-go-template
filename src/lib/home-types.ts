export const HOME_TYPES = [
  { id: "house", label: "House" },
  { id: "apartment", label: "Apartment" },
  { id: "condo", label: "Condo" },
  { id: "townhouse", label: "Townhouse" },
  { id: "cabin", label: "Cabin" },
  { id: "villa", label: "Villa" },
  { id: "loft", label: "Loft" },
  { id: "cottage", label: "Cottage" },
  { id: "guesthouse", label: "Guesthouse" },
  { id: "other", label: "Other" },
] as const;

export type HomeTypeId = (typeof HOME_TYPES)[number]["id"];

export function homeTypeLabel(homeType: string | null | undefined): string {
  if (!homeType) return "Home";
  return HOME_TYPES.find((t) => t.id === homeType)?.label ?? homeType;
}
