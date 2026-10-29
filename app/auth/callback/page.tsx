"use client";

import Link from "next/link";
import "@/styles/auth.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthResponse } from "@/lib/api/auth";
import { useAuth } from "@/providers/AuthProvider";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [failed, setFailed] = useState(false);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const token = fragment.get("token");
    const userValue = fragment.get("user");
    window.history.replaceState(null, "", window.location.pathname);

    if (!token || !userValue || fragment.has("error")) {
      setFailed(true);
      return;
    }

    try {
      const user = JSON.parse(userValue) as AuthResponse["user"];
      if (!user.id || !user.email || !user.fullName) throw new Error("Invalid account data.");
      signIn({ token, user });
      router.replace("/dashboard");
    } catch {
      setFailed(true);
    }
  }, [router, signIn]);

  if (failed) {
    return (
      <main className="oauth-result-page">
        <h1>Google sign-in could not be completed</h1>
        <p>Please try again, or use your email and password to sign in.</p>
        <Link href="/login" className="crm-submit oauth-retry">Back to sign in</Link>
      </main>
    );
  }

  return <main className="oauth-result-page" aria-live="polite">Completing Google sign-in…</main>;
}
