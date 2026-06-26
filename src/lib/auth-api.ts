import { apiFetch } from "./api";

export function authFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}
