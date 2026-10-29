"use client";

import { API_BASE_URL } from "@/lib/api/client";

export function GoogleSignInButton() {
  return (
    <>
      <div className="crm-divider"><span>Or continue with</span></div>
      <button
        className="crm-social google crm-google-button"
        type="button"
        onClick={() => window.location.assign(`${API_BASE_URL}/api/auth/google`)}
      >
        <span className="social-icon" aria-hidden="true">G</span>
        Continue with Google
      </button>
    </>
  );
}
