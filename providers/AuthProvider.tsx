"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthResponse, User } from "@/lib/api/auth";
import { AUTH_STORAGE_KEY, readStoredAuth } from "@/lib/auth/storage";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isReady: boolean;
  signIn: (auth: AuthResponse) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const auth = readStoredAuth();
    if (auth) {
      setUser(auth.user);
      setToken(auth.token);
    }
    setIsReady(true);
  }, []);

  const signIn = useCallback((auth: AuthResponse) => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    setUser(auth.user);
    setToken(auth.token);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isReady, signIn, signOut }),
    [user, token, isReady, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
