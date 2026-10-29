import Link from "next/link";
import "@/styles/auth.css";

type AuthShellProps = {
  children: React.ReactNode;
  quote: string;
  author: string;
  role: string;
  linkText: string;
  linkLabel: string;
  linkHref: string;
};

export function AuthShell({
  children,
  quote,
  author,
  role,
  linkText,
  linkLabel,
  linkHref,
}: AuthShellProps) {
  return (
    <div className="crm-page">
      <div className="crm-shell">
        <aside className="crm-hero">
          <div className="crm-hero-pattern" />
          <div className="crm-hero-inner">
            <div className="crm-hero-topbar">
              <div className="crm-logo-badge"><span className="crm-logo-mark">C</span></div>
            </div>
            <div className="crm-hero-quote">{quote}</div>
            <div className="crm-hero-author">
              <span className="crm-hero-author-name">{author}</span>
              <span className="crm-hero-author-role">{role}</span>
            </div>
          </div>
        </aside>

        <main className="crm-main">
          <header className="crm-header">
            <div className="crm-brand">
              <div className="crm-brand-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64">
                  <path d="M32 12c8.2 0 14.9 6.7 14.9 14.9v7.3c0 8.2-6.7 14.9-14.9 14.9S17.1 42.4 17.1 34.2v-7.3C17.1 18.7 23.8 12 32 12Zm0 9.5c-2.9 0-5.4 2.4-5.4 5.4v7.3c0 2.9 2.4 5.4 5.4 5.4s5.4-2.4 5.4-5.4v-7.3c0-3-2.4-5.4-5.4-5.4Z" />
                  <path d="M14.5 16.5c0-2.7 2.1-4.8 4.8-4.8h29.4c2.7 0 4.8 2.1 4.8 4.8v5.2a6.5 6.5 0 0 1-6.5 6.5h-3.2v-4.7h2.7v-2.6H19.4v2.6h2.8v4.7h-3.2a6.5 6.5 0 0 1-6.5-6.5v-5.2Z" />
                </svg>
              </div>
              <span>CRM</span>
              <strong>Workspace</strong>
            </div>
            <Link href={linkHref} className="crm-signin">
              {linkText} <span>{linkLabel}</span>
            </Link>
          </header>

          {children}

          <aside className="crm-assistance">
            <div className="crm-assistance-block">
              <h2>Need assistance?</h2>
              <p>Contact your CRM administrator for help with your account.</p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
