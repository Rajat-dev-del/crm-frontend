"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { controlClass } from "@/components/ui/form";
import { propertiesApi } from "@/features/properties/api";
import type { Property } from "@/features/properties/types";
import { useDismiss } from "@/lib/hooks/useDismiss";
import { cn } from "@/lib/utils/cn";

type PropertyPickerProps = {
  id: string;
  /** Property name; empty when none is chosen. */
  value: string;
  onChange: (name: string) => void;
};

export function PropertyPicker({ id, value, onChange }: PropertyPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setError(null);
  }, []);
  useDismiss(containerRef, open, close);

  useEffect(() => {
    if (!open) return;
    let active = true;
    propertiesApi.list({ page: 1, limit: 200, search: "" }).then((result) => {
      if (active) setProperties(result.properties);
    });
    return () => {
      active = false;
    };
  }, [open]);

  const term = query.trim();
  const list = properties ?? [];
  const matches = term
    ? list.filter((p) => p.name.toLowerCase().includes(term.toLowerCase()) || (p.location ?? "").toLowerCase().includes(term.toLowerCase()))
    : list;
  const exactMatch = list.find((p) => p.name.toLowerCase() === term.toLowerCase());

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
      const property = await propertiesApi.create({ name: term, type: "Apartment", location: "" });
      setProperties((current) => (current ? [property, ...current] : [property]));
      select(property.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The property could not be added.");
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
        <span className={value ? "text-heading" : "text-muted"}>{value || "Select property or project"}</span>
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
              maxLength={120}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (matches.length === 1 && !exactMatch) select(matches[0].name);
                  else void add();
                }
              }}
              placeholder="Search or add a property…"
              aria-label="Search properties"
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
            {adding ? "Adding…" : exactMatch ? `Select "${exactMatch.name}"` : term ? `Add property "${term}"` : "Add property"}
          </button>
          {!term && <p className="mt-1.5 text-center text-caption text-muted">Type to search or add a new property.</p>}
          {error && <p role="alert" className="mt-2 text-caption text-danger-600">{error}</p>}

          <ul role="listbox" aria-label="Properties" className="mt-3 max-h-60 overflow-y-auto rounded-lg border border-line">
            {properties === null && <li className="px-4 py-3 text-caption text-muted">Loading properties…</li>}
            {properties !== null && matches.length === 0 && (
              <li className="px-4 py-3 text-caption text-muted">No properties match &ldquo;{term}&rdquo;.</li>
            )}
            {matches.map((property) => {
              const selected = property.name === value;
              return (
                <li key={property.id} role="option" aria-selected={selected} className="border-b border-line last:border-0">
                  <button
                    type="button"
                    onClick={() => select(property.name)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left text-label hover:bg-surface-muted",
                      selected ? "text-primary-600 dark:text-primary-300" : "text-heading",
                    )}
                  >
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{property.name}</p>
                      {property.location && <p className="truncate text-caption text-muted">{property.type} · {property.location}</p>}
                      {!property.location && <p className="text-caption text-muted">{property.type}</p>}
                    </div>
                    {selected && <Check className="size-4 shrink-0" aria-hidden />}
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
