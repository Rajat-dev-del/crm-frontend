"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

/** Renders children only for a signed-in user; otherwise redirects to /login. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !user) router.replace("/login");
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-label text-muted" aria-live="polite">
        Loading your workspace…
      </div>
    );
  }

  return children;
}
