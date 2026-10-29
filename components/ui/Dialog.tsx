"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type DialogSize = "sm" | "md" | "lg";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: DialogSize;
  children: React.ReactNode;
};

const sizes: Record<DialogSize, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-5xl",
};

/**
 * Modal built on the native <dialog>: focus trapping, Escape to close and the backdrop come
 * from the browser. Render it only while needed (or keep it mounted and toggle `open`).
 */
export function Dialog({ open, onClose, title, description, size = "md", children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      aria-labelledby={titleId}
      className={cn(
        "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] rounded-card border border-line bg-surface p-0 text-body shadow-popover backdrop:bg-heading/40",
        sizes[size],
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
        <div>
          <h2 id={titleId} className="text-subtitle">{title}</h2>
          {description && <p className="mt-1 text-caption text-muted">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1.5 text-muted hover:bg-surface-muted hover:text-heading"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  );
}
