"use client";

import { useCallback, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { controlClass } from "@/components/ui/form";
import type { LeadStatusOption } from "@/features/leads/types";
import { useDismiss } from "@/lib/hooks/useDismiss";
import { cn } from "@/lib/utils/cn";

type StatusPickerProps = {
  id: string;
  value: string;
  /** null while the list is loading. */
  statuses: LeadStatusOption[] | null;
  onChange: (name: string) => void;
  onAdd: (name: string) => Promise<LeadStatusOption>;
};

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Searchable status dropdown where users can also create a new status. */
export function StatusPicker({ id, value, statuses, onChange, onAdd }: StatusPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setError(null);
  }, []);
  useDismiss(containerRef, open, close);

  const term = query.trim();
  const list = statuses ?? [];
  const matches = term ? list.filter((status) => status.name.toLowerCase().includes(term.toLowerCase())) : list;
  const exactMatch = list.find((status) => sameName(status.name, term));

  function select(name: string) {
    onChange(name);
    close();
  }

  async function add() {
    if (!term) return;
    if (exactMatch) return select(exactMatch.name);
    setAdding(true);
    setError(null);
    try {
      const status = await onAdd(term);
      select(status.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The status could not be added.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(controlClass, "flex h-11 items-center justify-between text-left")}
      >
        <span className={value ? "text-heading" : "text-muted"}>{value || "Select status"}</span>
        <ChevronDown className={cn("size-4 text-muted transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-card border border-line bg-surface p-3 shadow-popover">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={query}
              autoFocus
              maxLength={40}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (matches.length === 1 && !exactMatch) select(matches[0].name);
                  else void add();
                }
              }}
              placeholder="Search or type a new status…"
              aria-label="Search statuses"
              className={cn(controlClass, "h-10 rounded-full bg-surface-muted pl-9")}
            />
          </div>

          <button
            type="button"
            onClick={add}
            disabled={!term || adding}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-500 text-label font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
          >
            <Plus className="size-4" aria-hidden />
            {adding ? "Adding…" : exactMatch ? `Use "${exactMatch.name}"` : term ? `Add status "${term}"` : "Add status"}
          </button>
          {!term && <p className="mt-1.5 text-center text-caption text-muted">Type a name above to add a new status.</p>}
          {error && <p role="alert" className="mt-2 text-caption text-danger-600">{error}</p>}

          <ul role="listbox" aria-label="Statuses" className="mt-3 max-h-60 overflow-y-auto rounded-lg border border-line">
            {statuses === null && <li className="px-4 py-3 text-caption text-muted">Loading statuses…</li>}
            {statuses !== null && matches.length === 0 && (
              <li className="px-4 py-3 text-caption text-muted">No statuses match &ldquo;{term}&rdquo;.</li>
            )}
            {matches.map((status) => {
              const selected = sameName(status.name, value);
              return (
                <li key={status.id} role="option" aria-selected={selected} className="border-b border-line last:border-0">
                  <button
                    type="button"
                    onClick={() => select(status.name)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left text-label hover:bg-surface-muted",
                      selected ? "text-primary-600 dark:text-primary-300" : "text-heading",
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-label font-semibold text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
                      {status.name[0]?.toUpperCase()}
                    </span>
                    <span className="flex-1 truncate">{status.name}</span>
                    {selected && <Check className="size-4" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
