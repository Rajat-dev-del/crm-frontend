"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils/cn";

const DESKTOP_QUERY = "(min-width: 64rem)"; // Tailwind `lg`

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  function toggleSidebar() {
    if (window.matchMedia(DESKTOP_QUERY).matches) setCollapsed((value) => !value);
    else setMobileOpen((value) => !value);
  }

  return (
    <div className="min-h-screen">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {mobileOpen && (
        <div aria-hidden className="fixed inset-0 z-30 bg-heading/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200",
          collapsed ? "lg:pl-(--sidebar-collapsed-width)" : "lg:pl-(--sidebar-width)",
        )}
      >
        <Header collapsed={collapsed} sidebarExpanded={mobileOpen || !collapsed} onToggleSidebar={toggleSidebar} />
        <main id="main-content" className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
