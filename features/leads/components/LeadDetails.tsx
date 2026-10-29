import { Badge } from "@/components/ui/Badge";
import { sourceLabel, statusMeta } from "@/features/leads/constants";
import type { Lead } from "@/features/leads/types";
import { formatDate, formatTime } from "@/lib/utils/format";

export function LeadDetails({ lead }: { lead: Lead }) {
  const status = statusMeta(lead.status);
  const rows: [string, React.ReactNode][] = [
    ["Phone", lead.phone],
    ["Email", lead.email],
    [
      "Status",
      <span key="status" className="flex flex-wrap gap-1.5">
        <Badge tone={status.tone}>{status.label}</Badge>
        {lead.isDuplicate && <Badge tone="warning">Duplicate</Badge>}
      </span>,
    ],
    ["Source", sourceLabel(lead.source)],
    ["Property / Project", lead.project],
    ["Budget", lead.budget],
    ["Occupation", lead.occupation],
    ["State", lead.state],
    ["Assigned to", lead.assignedTo],
    ["Created", `${formatDate(lead.createdAt)}, ${formatTime(lead.createdAt)}`],
    ["Address", lead.address],
    ["Message / Notes", lead.notes],
  ];

  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className={label === "Address" || label === "Message / Notes" ? "sm:col-span-2" : undefined}>
          <dt className="text-caption font-medium text-muted">{label}</dt>
          <dd className="mt-1 text-label font-normal break-words whitespace-pre-line text-heading">{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
