"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { leadsApi } from "@/features/leads/api";
import { LEAD_SOURCES } from "@/features/leads/constants";
import type { LeadInput, LeadSource } from "@/features/leads/types";
import { cn } from "@/lib/utils/cn";

// Recognised CSV header names (lower-case) → LeadInput field
const HEADER_MAP: Record<string, keyof LeadInput> = {
  name: "name",
  phone: "phone",
  "phone no": "phone",
  "phone number": "phone",
  mobile: "phone",
  source: "source",
  project: "project",
  status: "status",
  budget: "budget",
  email: "email",
  occupation: "occupation",
  state: "state",
  city: "city",
  notes: "notes",
  address: "address",
  "assigned to": "assignedTo",
  assignedto: "assignedTo",
};

const VALID_SOURCES = new Set<string>(LEAD_SOURCES.map((s) => s.value));
const SOURCE_ALIASES: Record<string, LeadSource> = {
  meta: "meta_ad",
  "meta ad": "meta_ad",
  facebook: "meta_ad",
  "facebook ad": "meta_ad",
  google: "google_ad",
  "google ad": "google_ad",
  website: "website",
  manual: "manual",
  "99acres": "99acres",
  "99 acres": "99acres",
};

function toSource(raw: string): LeadSource {
  const lower = raw.trim().toLowerCase();
  return SOURCE_ALIASES[lower] ?? (VALID_SOURCES.has(lower) ? (lower as LeadSource) : "manual");
}

/** Minimal RFC-4180 CSV parser — handles quoted fields and CRLF/LF line endings. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
      if (ch === "\r") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  // Drop blank rows
  return rows.filter((r) => r.some((c) => c.trim()));
}

type ParsedRow = { input: LeadInput; errors: string[] };

function mapRows(csvRows: string[][]): ParsedRow[] {
  if (csvRows.length < 2) return [];
  const headers = csvRows[0].map((h) => h.trim().toLowerCase());
  const fieldAt = headers.map((h) => HEADER_MAP[h] ?? null);

  return csvRows.slice(1).map((cells) => {
    const raw: Partial<Record<keyof LeadInput, string>> = {};
    fieldAt.forEach((key, i) => {
      if (key !== null) raw[key] = (cells[i] ?? "").trim();
    });

    const errors: string[] = [];
    if (!raw.name?.trim()) errors.push("Name is required");
    if (!raw.phone?.trim()) errors.push("Phone is required");

    const input: LeadInput = {
      name: raw.name ?? "",
      phone: raw.phone ?? "",
      email: raw.email ?? "",
      occupation: raw.occupation ?? "",
      project: raw.project ?? "",
      status: raw.status?.trim() || "New",
      source: toSource(raw.source ?? "manual"),
      budget: raw.budget ?? "",
      city: raw.city ?? "",
      state: raw.state ?? "",
      assignedTo: raw.assignedTo ?? "",
      address: raw.address ?? "",
      notes: raw.notes ?? "",
    };

    return { input, errors };
  });
}

const TEMPLATE_CSV =
  "Name,Phone,Source,Project,Status,Budget,Email,State,Notes\r\n" +
  "Rajesh Kumar,9876543210,manual,,New,,,Maharashtra,\r\n" +
  "Priya Sharma,9123456789,google_ad,Green Park,Followup,50 lakh,priya@email.com,Delhi,\r\n";

function downloadTemplate() {
  const blob = new Blob(["﻿" + TEMPLATE_CSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

type ImportResult = { imported: number; failed: number };
type Props = { open: boolean; onClose: () => void; onImported: () => void };

export function BulkUploadDialog({ open, onClose, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<ParsedRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const valid = parsed?.filter((r) => r.errors.length === 0) ?? [];
  const invalid = parsed?.filter((r) => r.errors.length > 0) ?? [];

  function reset() {
    setParsed(null);
    setFileName("");
    setResult(null);
    setParseError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleFile(file: File) {
    setFileName(file.name);
    setResult(null);
    setParseError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCsv(text);
        if (rows.length < 2) {
          setParseError("The file has no data rows.");
          setParsed(null);
          return;
        }
        const headers = rows[0].map((h) => h.trim().toLowerCase());
        const hasName = headers.some((h) => HEADER_MAP[h] === "name");
        const hasPhone = headers.some((h) => HEADER_MAP[h] === "phone");
        if (!hasName || !hasPhone) {
          setParseError('The CSV must have "Name" and "Phone" columns.');
          setParsed(null);
          return;
        }
        setParsed(mapRows(rows));
      } catch {
        setParseError("Could not read the file. Make sure it is a valid CSV.");
        setParsed(null);
      }
    };
    reader.readAsText(file, "utf-8");
  }

  async function handleImport() {
    if (!valid.length) return;
    setImporting(true);
    let imported = 0;
    let failed = 0;
    for (const row of valid) {
      try {
        await leadsApi.create(row.input);
        imported++;
      } catch {
        failed++;
      }
    }
    setImporting(false);
    setResult({ imported, failed });
    if (imported > 0) onImported();
  }

  return (
    <Dialog open={open} size="lg" title="Bulk upload leads" onClose={handleClose}>
      {result ? (
        <div className="grid gap-5">
          <div className="flex items-start gap-3 rounded-xl bg-success-50 px-4 py-4 dark:bg-success-500/15">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success-600" aria-hidden />
            <div>
              <p className="text-label text-success-700 dark:text-success-400">
                {result.imported} lead{result.imported !== 1 ? "s" : ""} imported successfully.
              </p>
              {result.failed > 0 && (
                <p className="mt-0.5 text-caption text-body">{result.failed} rows failed to import.</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={reset}>Upload another file</Button>
            <Button onClick={handleClose}>Done</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5">
          {/* Drop / pick zone */}
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-line p-8 text-center transition-colors",
              "hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/5 cursor-pointer",
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload CSV file"
            onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500/10">
              <Upload className="size-6 text-primary-600" aria-hidden />
            </div>
            <div>
              <p className="text-label text-heading">Drop a CSV file here, or click to choose</p>
              {fileName ? (
                <p className="mt-1 text-caption text-primary-600">{fileName}</p>
              ) : (
                <p className="mt-1 text-caption text-muted">Supported: .csv</p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadTemplate();
            }}
            className="text-caption text-primary-600 underline-offset-2 hover:underline self-start"
          >
            Download sample template
          </button>

          {parseError && (
            <div className="flex items-start gap-2 rounded-xl bg-danger-50 px-4 py-3 dark:bg-danger-500/15">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger-600" aria-hidden />
              <p className="text-label font-normal text-danger-600">{parseError}</p>
            </div>
          )}

          {parsed !== null && (
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-label text-body">{parsed.length} rows found</span>
                <Badge tone="success">{valid.length} valid</Badge>
                {invalid.length > 0 && <Badge tone="danger">{invalid.length} with errors</Badge>}
              </div>

              {/* Preview table — first 20 rows */}
              <div className="overflow-auto rounded-xl border border-line max-h-60">
                <table className="w-full text-caption">
                  <thead className="sticky top-0 bg-surface-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted">#</th>
                      <th className="px-3 py-2 text-left font-medium text-muted">Name</th>
                      <th className="px-3 py-2 text-left font-medium text-muted">Phone</th>
                      <th className="px-3 py-2 text-left font-medium text-muted">Status</th>
                      <th className="px-3 py-2 text-left font-medium text-muted">Issues</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-surface">
                    {parsed.slice(0, 20).map((row, i) => (
                      <tr
                        key={i}
                        className={row.errors.length > 0 ? "bg-danger-50/60 dark:bg-danger-500/10" : ""}
                      >
                        <td className="px-3 py-2 text-muted">{i + 1}</td>
                        <td className="px-3 py-2 text-heading">
                          {row.input.name || <span className="italic text-muted">—</span>}
                        </td>
                        <td className="px-3 py-2 text-body">
                          {row.input.phone || <span className="italic text-muted">—</span>}
                        </td>
                        <td className="px-3 py-2 text-body">{row.input.status}</td>
                        <td className="px-3 py-2">
                          {row.errors.length > 0 ? (
                            <span className="text-danger-600">{row.errors.join(", ")}</span>
                          ) : (
                            <CheckCircle2 className="size-4 text-success-500" aria-hidden />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.length > 20 && (
                  <p className="border-t border-line bg-surface px-3 py-2 text-caption text-muted">
                    … and {parsed.length - 20} more rows
                  </p>
                )}
              </div>

              {invalid.length > 0 && (
                <p className="text-caption text-muted">
                  Rows with errors will be skipped. Fix them in the CSV and re-upload to import them.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button disabled={!valid.length || importing} onClick={handleImport}>
              {importing ? "Importing…" : `Import ${valid.length} lead${valid.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
