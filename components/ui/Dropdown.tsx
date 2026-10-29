"use client";

import { useCallback, useRef, useState } from "react";
import { useDismiss } from "@/lib/hooks/useDismiss";
import { cn } from "@/lib/utils/cn";

type DropdownProps = {
  /** Accessible name for the trigger button. */
  label: string;
  /** Contents of the trigger button (icon, avatar…). */
  trigger: React.ReactNode;
  triggerClassName?: string;
  panelClassName?: string;
  /** Panel contents; receives `close` so items can dismiss the panel. */
  children: (close: () => void) => React.ReactNode;
};

export function Dropdown({ label, trigger, triggerClassName, panelClassName, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(containerRef, open, close);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-50 mt-2 w-64 rounded-card border border-line bg-surface p-2 shadow-popover",
            panelClassName,
          )}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}
