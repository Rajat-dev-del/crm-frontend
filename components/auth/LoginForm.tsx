"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/providers/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const auth = await authApi.login({
        email: String(formData.get("email") || "").trim(),
        password: String(formData.get("password") || ""),
      });
      signIn(auth);
      router.push("/dashboard");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Login failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="crm-form-box crm-login-box">
      <div className="crm-login-header">
        <h1>Sign in</h1>
        <p>Welcome back! Please sign in to continue.</p>
      </div>
      <form className="crm-form" onSubmit={handleSubmit}>
        <label className="crm-field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={320}
            required
          />
        </label>

        <label className="crm-field">
          <span>Password</span>
          <PasswordInput
            name="password"
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <p className="auth-message auth-error" role="alert">
            {error}
          </p>
        )}
        <button className="crm-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>

      <GoogleSignInButton />

      <footer className="crm-footer">
        <div className="crm-footer-links">
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
        <p>©2026 CRM Workspace. All rights reserved.</p>
      </footer>
    </section>
  );
}
