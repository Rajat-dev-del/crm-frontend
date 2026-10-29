"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { navigation, type NavDotColor, type NavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

type SidebarProps = {
  /** Desktop icon-only mode. */
  collapsed: boolean;
  /** Mobile drawer visibility. */
  mobileOpen: boolean;
  onClose: () => void;
};

const dotColors: Record<NavDotColor, string> = {
  primary: "bg-primary-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  purple: "bg-purple-500",
  info: "bg-info-500",
};

function isActive(pathname: string, href?: string) {
  return Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`));
}

export function Sidebar({ collapsed, mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      id="app-sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-(--sidebar-width) flex-col border-r border-line bg-surface transition-[width,translate] duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
        collapsed && "lg:w-(--sidebar-collapsed-width)",
      )}
    >
      <div
        className={cn(
          "flex h-(--header-height) shrink-0 items-center justify-between gap-2 px-5",
          collapsed && "lg:justify-center lg:px-0",
        )}
      >
        <Link href={siteConfig.homePath} onClick={onClose} className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-400 to-primary-600 text-subtitle font-bold text-white shadow-sm">
            {siteConfig.logoLetter}
          </span>
          <span className={cn("min-w-0", collapsed && "lg:hidden")}>
            <span className="block truncate text-subtitle font-bold text-heading">{siteConfig.name}</span>
            <span className="block truncate text-caption text-muted">{siteConfig.tagline}</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-md p-1.5 text-muted hover:bg-surface-muted hover:text-heading lg:hidden"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <nav aria-label="Main" className={cn("flex-1 overflow-y-auto px-4 py-4", collapsed && "lg:px-3")}>
        {navigation.map((section, index) => (
          <div key={section.title ?? index} className="mb-6 last:mb-0">
            {section.title && (
              <p className={cn("mb-3 px-3 text-overline uppercase text-muted", collapsed && "lg:sr-only")}>
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.label}>
                  {item.children?.length ? (
                    <NavGroup item={item} pathname={pathname} collapsed={collapsed} onNavigate={onClose} />
                  ) : (
                    <NavLink item={item} active={isActive(pathname, item.href)} collapsed={collapsed} onNavigate={onClose} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <p className={cn("shrink-0 border-t border-line px-5 py-3 text-caption text-muted", collapsed && "lg:hidden")}>
        {siteConfig.name} · {siteConfig.version}
      </p>
    </aside>
  );
}

const itemClass =
  "relative flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-nav transition-colors";
// Tinted pill with an accent bar on the left edge.
const activeClass =
  "bg-primary-50 text-primary-600 before:absolute before:inset-y-2 before:-left-1 before:w-1 before:rounded-full before:bg-primary-500 dark:bg-primary-500/15 dark:text-primary-300";
const idleClass = "text-heading hover:bg-surface-muted";

type NavLinkProps = { item: NavItem; active: boolean; collapsed: boolean; onNavigate: () => void };

function NavLink({ item, active, collapsed, onNavigate }: NavLinkProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href ?? "#"}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(itemClass, active ? activeClass : idleClass, collapsed && "lg:justify-center lg:px-0")}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
      <span className={cn("truncate", collapsed && "lg:sr-only")}>{item.label}</span>
    </Link>
  );
}

type NavGroupProps = { item: NavItem; pathname: string; collapsed: boolean; onNavigate: () => void };

function NavGroup({ item, pathname, collapsed, onNavigate }: NavGroupProps) {
  const Icon = item.icon;
  const children = item.children ?? [];
  const hasActiveChild = children.some((child) => pathname === child.href);
  const [open, setOpen] = useState(hasActiveChild);
  const listId = `nav-group-${item.label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={listId}
        title={collapsed ? item.label : undefined}
        className={cn(itemClass, hasActiveChild ? activeClass : idleClass, collapsed && "lg:justify-center lg:px-0")}
      >
        <Icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
        <span className={cn("flex-1 truncate text-left", collapsed && "lg:sr-only")}>{item.label}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180", collapsed && "lg:hidden")}
          aria-hidden
        />
      </button>
      {open && (
        <ul id={listId} className={cn("mt-1 space-y-1 pl-6", collapsed && "lg:hidden")}>
          {children.map((child) => {
            const active = pathname === child.href;
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-label transition-colors",
                    active ? "text-primary-600 dark:text-primary-300" : "text-body hover:text-heading",
                  )}
                >
                  <span className={cn("size-1.5 shrink-0 rounded-full", dotColors[child.dot ?? "primary"])} aria-hidden />
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
