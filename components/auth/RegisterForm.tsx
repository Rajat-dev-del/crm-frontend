"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/providers/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function RegisterForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const phoneDigits = String(formData.get("phone") || "").trim();
    const phone = phoneDigits ? `+91 ${phoneDigits}` : undefined;

    try {
      const auth = await authApi.register({
        fullName: String(formData.get("fullName") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        password: String(formData.get("password") || ""),
        phone,
      });
      signIn(auth);
      router.push("/dashboard");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Registration failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="crm-form-box">
      <h1>Get started with your 15-day free trial.</h1>
      <form className="crm-form" onSubmit={handleSubmit}>
        <label className="crm-field">
          <span>Full Name</span>
          <input
            name="fullName"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={120}
            required
          />
        </label>

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
          <span>Create Password</span>
          <PasswordInput
            name="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={() => setPasswordTouched(true)}
            aria-invalid={
              passwordTouched && password.length > 0 && password.length < 8
            }
            aria-describedby={
              passwordTouched && password.length > 0 && password.length < 8
                ? "password-length-error"
                : undefined
            }
          />
        </label>
        {passwordTouched && password.length > 0 && password.length < 8 && (
          <p
            className="crm-password-hint"
            id="password-length-error"
            role="alert"
          >
            Use at least 8 characters for your password.
          </p>
        )}

        <label className="crm-field">
          <span>Phone Number (optional)</span>
          <div className="crm-phone-wrap">
            <span className="crm-country-code">+91</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel-national"
              maxLength={20}
            />
          </div>
        </label>

        <div className="crm-check-row">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I agree to the <a href="#terms">Terms of Service</a> and{" "}
            <a href="#privacy">Privacy Policy</a>.
          </label>
        </div>

        {error && (
          <p className="auth-message auth-error" role="alert">
            {error}
          </p>
        )}
        <button className="crm-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "CREATING ACCOUNT…" : "GET STARTED"}
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
