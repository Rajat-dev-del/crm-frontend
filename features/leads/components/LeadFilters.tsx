import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/form";
import { statusMeta } from "@/features/leads/constants";
import type { LeadStatusOption } from "@/features/leads/types";

export type LeadFilterValues = {
  /** Status name to match; empty for all statuses. */
  status: string;
  /** yyyy-mm-dd from the date inputs; empty when not set. */
  fromDate: string;
  toDate: string;
};

type LeadFiltersProps = {
  value: LeadFilterValues;
  statuses: LeadStatusOption[] | null;
  onChange: (value: LeadFilterValues) => void;
  onExport: () => void;
  exporting: boolean;
  onBulkUpload: () => void;
};

export const emptyLeadFilters: LeadFilterValues = { status: "", fromDate: "", toDate: "" };

export function LeadFilters({ value, statuses, onChange, onExport, exporting, onBulkUpload }: LeadFiltersProps) {
  const isFiltered = value.status !== "" || value.fromDate !== "" || value.toDate !== "";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid gap-3 sm:grid-cols-3 lg:flex lg:items-end">
        <Field label="Lead status" htmlFor="filter-status" className="lg:w-48">
          <Select
            id="filter-status"
            value={value.status}
            onChange={(event) => onChange({ ...value, status: event.target.value })}
          >
            <option value="">All statuses</option>
            {statuses?.map((status) => (
              <option key={status.id} value={status.name}>{statusMeta(status.name).label}</option>
            ))}
          </Select>
        </Field>
        <Field label="From date" htmlFor="filter-from" className="lg:w-44">
          <Input
            id="filter-from"
            type="date"
            value={value.fromDate}
            max={value.toDate || undefined}
            onChange={(event) => onChange({ ...value, fromDate: event.target.value })}
          />
        </Field>
        <Field label="To date" htmlFor="filter-to" className="lg:w-44">
          <Input
            id="filter-to"
            type="date"
            value={value.toDate}
            min={value.fromDate || undefined}
            onChange={(event) => onChange({ ...value, toDate: event.target.value })}
          />
        </Field>
        {isFiltered && (
          <Button variant="ghost" className="h-11" onClick={() => onChange(emptyLeadFilters)}>
            Clear filters
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" className="h-11" onClick={onExport} disabled={exporting}>
          <Download aria-hidden />
          {exporting ? "Exporting…" : "Export Excel"}
        </Button>
        <Button className="h-11" onClick={onBulkUpload}>
          <Upload aria-hidden />
          Bulk upload
        </Button>
      </div>
    </div>
  );
}
