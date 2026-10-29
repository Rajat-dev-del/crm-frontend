import { ArrowRight, Menu, Search } from "lucide-react";
import { LanguageMenu } from "@/components/layout/LanguageMenu";
import { NotificationMenu } from "@/components/layout/NotificationMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";

type HeaderProps = {
  /** Desktop sidebar is in icon-only mode. */
  collapsed: boolean;
  sidebarExpanded: boolean;
  onToggleSidebar: () => void;
};

export function Header({ collapsed, sidebarExpanded, onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) items-center gap-4 border-b border-line bg-surface px-4 sm:px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={sidebarExpanded ? "Collapse menu" : "Expand menu"}
        aria-controls="app-sidebar"
        aria-expanded={sidebarExpanded}
        className="rounded-md p-1.5 text-heading hover:bg-surface-muted"
      >
        <Menu className={collapsed ? "size-6 lg:hidden" : "size-6"} aria-hidden />
        {collapsed && <ArrowRight className="hidden size-6 lg:block" aria-hidden />}
      </button>

      <form role="search" className="relative hidden w-full max-w-xs md:block" onSubmit={(event) => event.preventDefault()}>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          placeholder="Search"
          aria-label="Search"
          className="h-10 w-full rounded-lg border border-line bg-surface-muted pl-9 pr-3 text-label text-heading placeholder:text-muted focus:border-primary-400 focus:bg-surface focus:outline-none"
        />
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <LanguageMenu />
        <NotificationMenu />
        <UserMenu />
      </div>
    </header>
  );
}
