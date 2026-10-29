"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/form";
import { Pagination } from "@/components/ui/Pagination";
import { propertiesApi } from "@/features/properties/api";
import type { Property, PropertyListResult, PropertyQuery } from "@/features/properties/types";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";

const columns: DataTableColumn<Property>[] = [
  {
    key: "name",
    header: "Property",
    render: (property) => <span className="font-semibold text-heading">{property.name}</span>,
  },
  { key: "type", header: "Type", render: (property) => property.type },
  { key: "location", header: "Location", render: (property) => property.location },
];

export function PropertiesView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [result, setResult] = useState<{ key: string; data: PropertyListResult } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search);
  const query = useMemo<PropertyQuery>(
    () => ({ search: debouncedSearch, page, limit }),
    [debouncedSearch, page, limit],
  );
  const queryKey = JSON.stringify(query);
  const loading = result?.key !== queryKey;

  useEffect(() => {
    let active = true;
    propertiesApi
      .list(query)
      .then((data) => active && setResult({ key: queryKey, data }))
      .catch((err: Error) => active && setError(err.message));
    return () => {
      active = false;
    };
  }, [query, queryKey]);

  const total = result?.data.total ?? 0;

  return (
    <Card className="grid gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search properties, type, location…"
            aria-label="Search properties"
            className="pl-10"
          />
        </div>
        <p className="text-caption text-muted">
          {total} {total === 1 ? "property" : "properties"}
        </p>
      </div>

      {error && <p role="alert" className="text-label text-danger-600">{error}</p>}

      <DataTable
        columns={columns}
        rows={result?.data.properties ?? []}
        getRowKey={(property) => property.id}
        loading={loading}
        emptyMessage="No properties yet. Add your first property."
        minWidthClass="min-w-xl"
      />

      <Pagination
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
      />
    </Card>
  );
}
