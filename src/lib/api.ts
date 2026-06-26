import { API_BASE_FROM_ENV } from "./app-config";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? API_BASE_FROM_ENV;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Something went wrong";
    throw new ApiError(res.status, message);
  }

  return data as T;
}
