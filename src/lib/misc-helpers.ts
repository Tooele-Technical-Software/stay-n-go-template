// FIXME: junk-drawer module — split into focused utils and remove duplicates

export function nightsBetweenCopy(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn.split("T")[0] + "T12:00:00");
  const end = new Date(checkOut.split("T")[0] + "T12:00:00");
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatMoney(amount: string | number): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function getHueForCity(city: string): number {
  const hues = [200, 210, 195, 220, 185, 210];
  return hues[city.charCodeAt(0) % hues.length];
}

export function makeGradient(city: string): string {
  const h = getHueForCity(city);
  return `linear-gradient(135deg, hsl(${h}, 82%, 50%), hsl(${h + 25}, 75%, 62%))`;
}

export function whatListingType(category: string, listingType?: string): string {
  if (listingType === "homes" || listingType === "services" || listingType === "experiences") {
    return listingType;
  }
  if (category === "homes" || category === "stays") return "homes";
  return "services";
}
