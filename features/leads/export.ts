import { sourceLabel, statusMeta } from "@/features/leads/constants";
import type { Lead } from "@/features/leads/types";
import { formatDate, formatTime } from "@/lib/utils/format";

function csvCell(value: string | null) {
  const text = value ?? "";
  // Quote every cell and neutralise spreadsheet formulas (=, +, -, @) from user input.
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** Downloads the given leads as a CSV file that opens in Excel. */
export function downloadLeadsCsv(leads: Lead[]) {
  const header = ["Name", "Phone", "Email", "Source", "Project", "Status", "Duplicate", "Budget", "State", "Assigned to", "Created"];
  const rows = leads.map((lead) => [
    lead.name,
    lead.phone,
    lead.email,
    sourceLabel(lead.source),
    lead.project,
    statusMeta(lead.status).label,
    lead.isDuplicate ? "Yes" : "No",
    lead.budget,
    lead.state,
    lead.assignedTo,
    `${formatDate(lead.createdAt)} ${formatTime(lead.createdAt)}`,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");

  // The BOM makes Excel read the file as UTF-8 (₹, Hindi names).
  const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
