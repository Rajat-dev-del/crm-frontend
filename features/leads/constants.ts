import type { LeadSourceOption } from "@/features/leads/types";

type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

/** Statuses every account starts with; users can add their own. Names drive the stat cards. */
export const DEFAULT_LEAD_STATUSES = ["New", "Followup", "Converted", "Dead"];
export const CONVERTED_STATUS = "converted";
export const DEAD_STATUS = "dead";

// Well-known names get a meaningful color; any other status gets a stable color from its name.
const knownTones: Record<string, BadgeTone> = {
  new: "primary",
  followup: "info",
  [CONVERTED_STATUS]: "success",
  [DEAD_STATUS]: "danger",
};
const fallbackTones: BadgeTone[] = ["primary", "info", "warning", "success", "neutral"];

export function statusTone(name: string): BadgeTone {
  const key = name.trim().toLowerCase();
  if (knownTones[key]) return knownTones[key];
  const hash = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return fallbackTones[hash % fallbackTones.length];
}

export const statusMeta = (status: string) => ({ label: status || "—", tone: statusTone(status) });

export const LEAD_SOURCES: LeadSourceOption[] = [
  { value: "meta_ad", label: "Meta ad" },
  { value: "google_ad", label: "Google ad" },
  { value: "website", label: "Website" },
  { value: "manual", label: "Manual" },
  { value: "99acres", label: "99acres" },
];

export const sourceLabel = (source: string) =>
  LEAD_SOURCES.find((item) => item.value === source || item.label.toLowerCase() === source.toLowerCase())?.label ?? source;

/** Mock team members shown in the Assigned to picker. */
export const MOCK_ASSIGNEES = ["Rahul Sharma", "Priya Singh", "Amit Patel", "Neha Gupta", "Vikas Mehta", "Anjali Verma"];
