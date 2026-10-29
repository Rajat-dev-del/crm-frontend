import { Eye, Mail, MessageCircle, Pencil, Phone, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/form";
import { normalizePhone } from "@/features/leads/api";
import { sourceLabel, statusMeta } from "@/features/leads/constants";
import type { Lead } from "@/features/leads/types";
import { cn } from "@/lib/utils/cn";
import { formatDate, formatTime, initials } from "@/lib/utils/format";

type LeadsTableProps = {
  leads: Lead[];
  loading: boolean;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

const headCell = "px-3 py-3 text-left text-caption font-semibold uppercase tracking-wider text-muted";
const actionButton =
  "inline-flex size-9 items-center justify-center rounded-lg border border-line text-body transition-colors hover:border-primary-300 hover:text-primary-600 [&_svg]:size-4";

export function LeadsTable({ leads, loading, selected, onToggle, onToggleAll, onView, onEdit, onDelete }: LeadsTableProps) {
  const allSelected = leads.length > 0 && leads.every((lead) => selected.has(lead.id));

  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full min-w-4xl border-collapse", loading && "opacity-60")} aria-busy={loading}>
        <thead>
          <tr className="border-b border-line">
            <th className="w-10 px-3 py-3">
              <Checkbox
                aria-label="Select all leads on this page"
                checked={allSelected}
                onChange={(event) => onToggleAll(event.target.checked)}
              />
            </th>
            <th className={headCell}>Lead</th>
            <th className={headCell}>Phone no.</th>
            <th className={headCell}>Source</th>
            <th className={headCell}>Project</th>
            <th className={headCell}>Status</th>
            <th className={headCell}>Created</th>
            <th className={headCell}>Contact</th>
            <th className={headCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 && (
            <tr>
              <td colSpan={9} className="px-3 py-16 text-center text-label font-normal text-muted">
                {loading ? "Loading leads…" : "No leads match your filters."}
              </td>
            </tr>
          )}
          {leads.map((lead) => {
            const status = statusMeta(lead.status);
            return (
              <tr key={lead.id} className="border-b border-line text-label font-normal text-body last:border-0 hover:bg-surface-muted/60">
                <td className="px-3 py-3.5">
                  <Checkbox aria-label={`Select ${lead.name}`} checked={selected.has(lead.id)} onChange={() => onToggle(lead.id)} />
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-label font-semibold text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
                      {initials(lead.name, 1)}
                    </span>
                    <span className="font-semibold text-heading">{lead.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3.5 whitespace-nowrap">{lead.phone}</td>
                <td className="px-3 py-3.5">
                  <Badge>{sourceLabel(lead.source)}</Badge>
                </td>
                <td className="px-3 py-3.5">{lead.project || "—"}</td>
                <td className="px-3 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone={status.tone}>{status.label}</Badge>
                    {lead.isDuplicate && <Badge tone="warning">Duplicate</Badge>}
                  </div>
                </td>
                <td className="px-3 py-3.5 whitespace-nowrap">
                  <p>{formatDate(lead.createdAt)}</p>
                  <p className="text-caption text-muted">{formatTime(lead.createdAt)}</p>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/91${normalizePhone(lead.phone)}`}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(actionButton, "hover:border-green-500 hover:text-green-600")}
                      aria-label={`WhatsApp ${lead.name}`}
                    >
                      <MessageCircle aria-hidden />
                    </a>
                    <a
                      href={`tel:${lead.phone}`}
                      className={cn(actionButton, "hover:border-blue-500 hover:text-blue-600")}
                      aria-label={`Call ${lead.name}`}
                    >
                      <Phone aria-hidden />
                    </a>
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className={cn(actionButton, "hover:border-orange-500 hover:text-orange-600")}
                        aria-label={`Email ${lead.name}`}
                      >
                        <Mail aria-hidden />
                      </a>
                    )}
                    {!lead.email && (
                      <span className={cn(actionButton, "cursor-not-allowed opacity-30")} aria-label="No email on file">
                        <Mail aria-hidden />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex gap-2">
                    <button type="button" className={actionButton} onClick={() => onView(lead)} aria-label={`View ${lead.name}`}>
                      <Eye aria-hidden />
                    </button>
                    <button type="button" className={actionButton} onClick={() => onEdit(lead)} aria-label={`Edit ${lead.name}`}>
                      <Pencil aria-hidden />
                    </button>
                    <button
                      type="button"
                      className={cn(actionButton, "hover:border-danger-500 hover:text-danger-600")}
                      onClick={() => onDelete(lead)}
                      aria-label={`Delete ${lead.name}`}
                    >
                      <Trash2 aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
