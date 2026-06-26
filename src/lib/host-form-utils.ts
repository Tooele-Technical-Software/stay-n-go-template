export const guestOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
export const bedroomOptions = [0, 1, 2, 3, 4, 5, 6, 7];
export const bathroomOptions = [0, 1, 2, 3, 4, 5];
export const MAX_BEDROOMS = 8;
export const MAX_BATHROOMS = 6;

export const homePriceSuggestions = [75, 100, 125, 150, 200, 250, 300];
export const experiencePriceSuggestions = [25, 50, 75, 100, 150, 200];

export function guestLabel(count: number) {
  return count === 1 ? "1 guest" : `${count} guests`;
}

export function roomLabel(count: number, kind: "bedroom" | "bathroom") {
  if (count === 0) return `No ${kind}s`;
  if (count === 1) return `1 ${kind}`;
  return `${count} ${kind}s`;
}

export function parseRoomCount(
  selectValue: string,
  customValue: string,
  minimum: number
): number {
  if (selectValue.endsWith("+")) {
    const parsed = parseInt(customValue, 10);
    return Number.isFinite(parsed) && parsed >= minimum ? parsed : minimum;
  }
  return parseInt(selectValue, 10);
}

export function initRoomSelect(
  count: number,
  maxInList: number,
  maxPlus: number
): { select: string; custom: string } {
  if (count > maxInList) {
    return { select: `${maxPlus}+`, custom: String(count) };
  }
  return { select: String(count), custom: "" };
}

export function initGuestSelect(count: number): string {
  if (guestOptions.includes(count)) return String(count);
  return String(guestOptions[guestOptions.length - 1]);
}

export function normalizePriceInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  return parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
}
