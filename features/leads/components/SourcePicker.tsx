"use client";

import { useCallback, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { controlClass } from "@/components/ui/form";
import { sourceLabel } from "@/features/leads/constants";
import type { LeadSourceOption } from "@/features/leads/types";
import { useDismiss } from "@/lib/hooks/useDismiss";
import { cn } from "@/lib/utils/cn";

type SourcePickerProps = {
  id: string;
  value: string;
  /** null while the list is loading. */
  sources: LeadSourceOption[] | null;
  onChange: (value: string) => void;
  onAdd: (label: string) => Promise<LeadSourceOption>;
};

const sameLabel = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function SourcePicker({ id, value, sources, onChange, onAdd }: SourcePickerProps) {
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
  const list = sources ?? [];
  const matches = term
    ? list.filter((s) => s.label.toLowerCase().includes(term.toLowerCase()))
    : list;
  const exactMatch = list.find((s) => sameLabel(s.label, term));

  function select(sourceValue: string) {
    onChange(sourceValue);
    close();
  }

  async function add() {
    if (!term) return;
    if (exactMatch) return select(exactMatch.value);
    setAdding(true);
    setError(null);
    try {
      const source = await onAdd(term);
      select(source.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The source could not be added.");
    } finally {
      setAdding(false);
    }
  }

  const displayLabel = sourceLabel(value) || "Select source";

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
        <span className={value ? "text-heading" : "text-muted"}>{displayLabel}</span>
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
                  if (matches.length === 1 && !exactMatch) select(matches[0].value);
                  else void add();
                }
              }}
              placeholder="Search or add a source…"
              aria-label="Search sources"
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
            {adding ? "Adding…" : exactMatch ? `Use "${exactMatch.label}"` : term ? `Add source "${term}"` : "Add source"}
          </button>
          {!term && <p className="mt-1.5 text-center text-caption text-muted">Type a name to search or add a new source.</p>}
          {error && <p role="alert" className="mt-2 text-caption text-danger-600">{error}</p>}

          <ul role="listbox" aria-label="Sources" className="mt-3 max-h-60 overflow-y-auto rounded-lg border border-line">
            {sources === null && <li className="px-4 py-3 text-caption text-muted">Loading sources…</li>}
            {sources !== null && matches.length === 0 && (
              <li className="px-4 py-3 text-caption text-muted">No sources match &ldquo;{term}&rdquo;.</li>
            )}
            {matches.map((source) => {
              const selected = source.value === value || sameLabel(source.label, sourceLabel(value));
              return (
                <li key={source.value} role="option" aria-selected={selected} className="border-b border-line last:border-0">
                  <button
                    type="button"
                    onClick={() => select(source.value)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left text-label hover:bg-surface-muted",
                      selected ? "text-primary-600 dark:text-primary-300" : "text-heading",
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-label font-semibold text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
                      {source.label[0]?.toUpperCase()}
                    </span>
                    <span className="flex-1 truncate">{source.label}</span>
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
