import type { AuthResponse } from "@/lib/api/auth";

export const AUTH_STORAGE_KEY = "crm.auth";

export function readStoredAuth(): AuthResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return null;
    const auth = JSON.parse(saved) as AuthResponse;
    return auth.token && auth.user?.id && auth.user?.email ? auth : null;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}
