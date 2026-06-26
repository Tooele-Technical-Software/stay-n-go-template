export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatCardExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCardCvc(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function cardDigitCount(value: string): number {
  return value.replace(/\D/g, "").length;
}

export function isDemoCardValid(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  return digits.length >= 13 && digits.length <= 19;
}

export function isExpiryValid(expiry: string): boolean {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [mm] = expiry.split("/").map(Number);
  return mm >= 1 && mm <= 12;
}

export function isCvcValid(cvc: string): boolean {
  const digits = cvc.replace(/\D/g, "");
  return digits.length >= 3 && digits.length <= 4;
}
