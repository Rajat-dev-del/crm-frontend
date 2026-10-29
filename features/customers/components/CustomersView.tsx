"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/form";
import { Pagination } from "@/components/ui/Pagination";
import { customersApi } from "@/features/customers/api";
import type { Customer, CustomerListResult, CustomerQuery } from "@/features/customers/types";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { formatDate, formatTime, initials } from "@/lib/utils/format";

const columns: DataTableColumn<Customer>[] = [
  {
    key: "name",
    header: "Customer",
    render: (customer) => (
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-label font-semibold text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
          {initials(customer.name, 1)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-heading">{customer.name}</p>
        </div>
      </div>
    ),
  },
  { key: "phone", header: "Phone", render: (customer) => customer.phone, className: "whitespace-nowrap" },
  { key: "email", header: "Email", render: (customer) => customer.email },
  { key: "occupation", header: "Occupation", render: (customer) => customer.occupation },
  { key: "project", header: "Property / Project", render: (customer) => customer.project },
  { key: "city", header: "City", render: (customer) => customer.city },
  { key: "state", header: "State", render: (customer) => customer.state },
  {
    key: "created",
    header: "Created",
    className: "whitespace-nowrap",
    render: (customer) => (
      <>
        <p>{formatDate(customer.createdAt)}</p>
        <p className="text-caption text-muted">{formatTime(customer.createdAt)}</p>
      </>
    ),
  },
];

export function CustomersView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [result, setResult] = useState<{ key: string; data: CustomerListResult } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search);
  const query = useMemo<CustomerQuery>(() => ({ search: debouncedSearch, page, limit }), [debouncedSearch, page, limit]);
  const queryKey = JSON.stringify(query);
  const loading = result?.key !== queryKey;

  useEffect(() => {
    let active = true;
    customersApi
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
            placeholder="Search customers, phone, project…"
            aria-label="Search customers"
            className="pl-10"
          />
        </div>
        <p className="text-caption text-muted">{total} {total === 1 ? "customer" : "customers"}</p>
      </div>

      {error && <p role="alert" className="text-label text-danger-600">{error}</p>}

      <DataTable
        columns={columns}
        rows={result?.data.customers ?? []}
        getRowKey={(customer) => customer.id}
        loading={loading}
        emptyMessage="No customers yet. Convert a lead or add a customer."
        minWidthClass="min-w-5xl"
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
