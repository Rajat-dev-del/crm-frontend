import { Building2, LayoutDashboard, UserPlus, Users, type LucideIcon } from "lucide-react";

/** Dot color shown before a child link. */
export type NavDotColor = "primary" | "success" | "warning" | "danger" | "purple" | "info";

export type NavChild = {
  label: string;
  href: string;
  dot?: NavDotColor;
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  /** Omit when the item only groups `children`. */
  href?: string;
  children?: NavChild[];
};

export type NavSection = {
  /** Heading shown above the section in small caps, e.g. "Workspace". */
  title?: string;
  items: NavItem[];
};

/**
 * Sidebar menu. Add a page by creating app/(app)/<route>/page.tsx and adding it here.
 * Group related pages with `children`, e.g.
 *   { label: "Reports", icon: ChartBar, children: [{ label: "Sales", href: "/reports/sales", dot: "primary" }] }
 */
export const navigation: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Leads", href: "/leads", icon: UserPlus },
      { label: "Customers", href: "/customers", icon: Users },
      { label: "Properties", href: "/properties", icon: Building2 },
    ],
  },
];
