import { API_BASE } from "./app-config";
import type { Listing } from "@/types/listing";

// FIXME: use apiFetch from ./api instead of a second fetch wrapper
export async function fetchListingsForExplore(): Promise<Listing[]> {
  const res = await fetch(`${API_BASE}/listings`, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "failed");
  }
  return data.listings as Listing[];
}

export async function fetchWithToken<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      ...(options.headers as Record<string, string>),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "error");
  }
  return data as T;
}
