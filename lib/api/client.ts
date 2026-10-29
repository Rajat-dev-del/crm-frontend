import { readStoredAuth } from "@/lib/auth/storage";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

export type ApiError = Error & { status?: number };

type ApiRequestOptions = RequestInit & { authenticated?: boolean };

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  let response: Response;
  const { authenticated = false, ...init } = options;

  try {
    const headers = new Headers(init.headers);
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    if (authenticated) {
      const token = readStoredAuth()?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new Error("Could not reach the API. Check that the backend is running and try again.");
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "The request could not be completed. Please try again.";
    const error = new Error(message) as ApiError;
    error.status = response.status;
    throw error;
  }

  return payload as T;
}
