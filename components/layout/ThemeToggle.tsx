"use client";

import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { applyTheme } from "@/lib/theme";

/** Icons follow the `dark` class via CSS, so no state or hydration mismatch is needed. */
export function ThemeToggle() {
  return (
    <IconButton
      aria-label="Toggle dark mode"
      onClick={() => applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")}
    >
      <Moon className="dark:hidden" aria-hidden />
      <Sun className="hidden dark:block" aria-hidden />
    </IconButton>
  );
}
