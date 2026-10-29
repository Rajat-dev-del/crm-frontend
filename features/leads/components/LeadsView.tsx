"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/form";
import { Pagination } from "@/components/ui/Pagination";
import { leadsApi } from "@/features/leads/api";
import { BulkUploadDialog } from "@/features/leads/components/BulkUploadDialog";
import { LeadDetails } from "@/features/leads/components/LeadDetails";
import { emptyLeadFilters, LeadFilters, type LeadFilterValues } from "@/features/leads/components/LeadFilters";
import { LeadForm } from "@/features/leads/components/LeadForm";
import { LeadStatCards } from "@/features/leads/components/LeadStatCards";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { downloadLeadsCsv } from "@/features/leads/export";
import { useLeadStatuses } from "@/features/leads/hooks/useLeadStatuses";
import type { Lead, LeadListResult, LeadQuery, LeadStats } from "@/features/leads/types";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { endOfDayIso, startOfDayIso } from "@/lib/utils/format";

type DialogState =
  | { type: "view" | "edit" | "delete"; lead: Lead }
  | { type: "delete-selected" }
  | { type: "bulk-upload" }
  | null;

export function LeadsView() {
  const [filters, setFilters] = useState<LeadFilterValues>(emptyLeadFilters);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // Bumped after every change so the list and stats reload.
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<{ key: string; data: LeadListResult } | null>(null);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<DialogState>(null);
  const [busy, setBusy] = useState(false);

  // Reloads after edits, so statuses added from the edit dialog show up in the filter.
  const { statuses } = useLeadStatuses(version);
  const debouncedSearch = useDebouncedValue(search);
  const query = useMemo<LeadQuery>(
    () => ({
      status: filters.status,
      from: filters.fromDate ? startOfDayIso(filters.fromDate) : undefined,
      to: filters.toDate ? endOfDayIso(filters.toDate) : undefined,
      search: debouncedSearch,
      page,
      limit,
    }),
    [filters, debouncedSearch, page, limit],
  );
  const queryKey = `${JSON.stringify(query)}#${version}`;
  const loading = result?.key !== queryKey;

  useEffect(() => {
    let active = true;
    leadsApi
      .list(query)
      .then((data) => active && setResult({ key: queryKey, data }))
      .catch((err: Error) => active && setError(err.message));
    return () => {
      active = false;
    };
  }, [query, queryKey]);

  useEffect(() => {
    let active = true;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    leadsApi
      .stats(todayStart.toISOString())
      .then((data) => active && setStats(data))
      .catch((err: Error) => active && setError(err.message));
    return () => {
      active = false;
    };
  }, [version]);

  const leads = result?.data.leads ?? [];
  const total = result?.data.total ?? 0;

  function changeQuery(apply: () => void) {
    apply();
    setPage(1);
    setSelected(new Set());
  }

  function refresh() {
    setVersion((value) => value + 1);
    setSelected(new Set());
  }

  async function runAndClose(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      setDialog(null);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleExport() {
    setBusy(true);
    try {
      const all = await leadsApi.list({ ...query, page: 1, limit: Math.max(total, 1) });
      downloadLeadsCsv(all.leads);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <LeadStatCards stats={stats} />

      <LeadFilters
        value={filters}
        statuses={statuses}
        onChange={(next) => changeQuery(() => setFilters(next))}
        onExport={handleExport}
        exporting={busy && dialog === null}
        onBulkUpload={() => setDialog({ type: "bulk-upload" })}
      />

      {error && (
        <p role="alert" className="rounded-lg bg-danger-50 px-4 py-3 text-label text-danger-600 dark:bg-danger-500/15">
          {error}
        </p>
      )}

      <Card className="grid gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <Input
              type="search"
              value={search}
              onChange={(event) => changeQuery(() => setSearch(event.target.value))}
              placeholder="Search leads, phone, project…"
              aria-label="Search leads"
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            {selected.size > 0 && (
              <Button variant="secondary" size="sm" onClick={() => setDialog({ type: "delete-selected" })}>
                <Trash2 aria-hidden />
                Delete {selected.size} selected
              </Button>
            )}
            <p className="text-caption text-muted">{total} {total === 1 ? "lead" : "leads"}</p>
          </div>
        </div>

        <LeadsTable
          leads={leads}
          loading={loading}
          selected={selected}
          onToggle={(id) =>
            setSelected((current) => {
              const next = new Set(current);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            })
          }
          onToggleAll={(checked) => setSelected(checked ? new Set(leads.map((lead) => lead.id)) : new Set())}
          onView={(lead) => setDialog({ type: "view", lead })}
          onEdit={(lead) => setDialog({ type: "edit", lead })}
          onDelete={(lead) => setDialog({ type: "delete", lead })}
        />

        <Pagination
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={(next) => {
            setPage(next);
            setSelected(new Set());
          }}
          onPageSizeChange={(size) => changeQuery(() => setLimit(size))}
        />
      </Card>

      {dialog?.type === "view" && (
        <Dialog open title={dialog.lead.name} description="Lead details" onClose={() => setDialog(null)}>
          <LeadDetails lead={dialog.lead} />
          <div className="mt-6 flex justify-end gap-3 border-t border-line pt-5">
            <Button variant="secondary" onClick={() => setDialog(null)}>Close</Button>
            <Button onClick={() => setDialog({ type: "edit", lead: dialog.lead })}>Edit lead</Button>
          </div>
        </Dialog>
      )}

      {dialog?.type === "edit" && (
        <Dialog open size="lg" title="Edit lead" onClose={() => setDialog(null)}>
          <LeadForm
            key={dialog.lead.id}
            lead={dialog.lead}
            submitLabel="Save changes"
            onCancel={() => setDialog(null)}
            onSubmit={(input) => runAndClose(() => leadsApi.update(dialog.lead.id, input))}
          />
        </Dialog>
      )}

      {(dialog?.type === "delete" || dialog?.type === "delete-selected") && (
        <Dialog open size="sm" title={dialog.type === "delete" ? "Delete lead?" : `Delete ${selected.size} leads?`} onClose={() => setDialog(null)}>
          <p className="text-label font-normal text-body">
            {dialog.type === "delete"
              ? `${dialog.lead.name} will be removed permanently.`
              : "The selected leads will be removed permanently."}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDialog(null)} disabled={busy}>Cancel</Button>
            <Button
              variant="danger"
              disabled={busy}
              onClick={() => runAndClose(() => leadsApi.remove(dialog.type === "delete" ? [dialog.lead.id] : [...selected]))}
            >
              {busy ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </Dialog>
      )}

      <BulkUploadDialog
        open={dialog?.type === "bulk-upload"}
        onClose={() => setDialog(null)}
        onImported={refresh}
      />
    </div>
  );
}
