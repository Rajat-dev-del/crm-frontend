import { parseBudget } from "@/features/leads/budget";
import { CONVERTED_STATUS, DEAD_STATUS, DEFAULT_LEAD_STATUSES, LEAD_SOURCES } from "@/features/leads/constants";
import type { Lead, LeadInput, LeadListResult, LeadQuery, LeadSourceOption, LeadStats, LeadStatusOption } from "@/features/leads/types";

/**
 * MOCK leads API — data lives in this browser's localStorage so the UI can be built before the
 * backend exists. To switch to the real API, keep these function signatures and replace each
 * body with an `apiRequest(..., { authenticated: true })` call from "@/lib/api/client".
 */

const STORAGE_KEY = "crm.mock-leads";

type StoredLead = Omit<Lead, "isDuplicate">;

/** SAMPLE rows shown the first time; delete them from the UI or clear localStorage. */
function seed(): StoredLead[] {
  const now = Date.now();
  const at = (hoursAgo: number) => new Date(now - hoursAgo * 3_600_000).toISOString();
  const base = { email: null, occupation: null, budget: null, city: null, state: null, assignedTo: null, address: null, notes: null };
  return [
    { ...base, id: "sample-1", name: "Asha Rao", phone: "9876543210", project: null, status: "Converted", source: "meta_ad", createdAt: at(30), updatedAt: at(30) },
    { ...base, id: "sample-2", name: "Ravi Kumar", phone: "9876543210", project: null, budget: "50 lakh – 1 crore", status: "Followup", source: "manual", createdAt: at(90), updatedAt: at(90) },
    { ...base, id: "sample-3", name: "Neha Singh", phone: "9123456780", project: "Rosewood Vista", status: "Converted", source: "99acres", createdAt: at(100), updatedAt: at(100) },
    { ...base, id: "sample-4", name: "Imran Shaikh", phone: "9988776655", project: "Green Park", budget: "80 lakh", status: "New", source: "google_ad", createdAt: at(110), updatedAt: at(110) },
  ];
}

function read(): StoredLead[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as StoredLead[];
  } catch {
    // Fall through to sample data when storage is unavailable or corrupted.
  }
  const initial = seed();
  write(initial);
  return initial;
}

function write(leads: StoredLead[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // Storage full or blocked: changes last until reload.
  }
}

const DAY_MS = 86_400_000;
const TREND_DAYS = 10;

/**
 * Sums `amount` per day for the last TREND_DAYS days (oldest first, ending today).
 * With `cumulative`, each point also includes everything before it, giving a running total.
 */
function dailySeries(
  todayStart: number,
  leads: StoredLead[],
  timeOf: (lead: StoredLead) => number,
  amount: (lead: StoredLead) => number,
  cumulative = false,
) {
  const firstDay = todayStart - (TREND_DAYS - 1) * DAY_MS;
  const series = new Array<number>(TREND_DAYS).fill(0);
  let before = 0;
  for (const lead of leads) {
    const time = timeOf(lead);
    if (time < firstDay) before += amount(lead);
    else series[Math.min(TREND_DAYS - 1, Math.floor((time - firstDay) / DAY_MS))] += amount(lead);
  }
  if (!cumulative) return series;
  let running = before;
  return series.map((value) => (running += value));
}

/** Status names match without regard to case or surrounding spaces. */
function sameStatus(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Digits only, last 10 kept, so "+91 98765 43210" and "9876543210" count as the same number. */
export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

function withDuplicates(all: StoredLead[], leads: StoredLead[]): Lead[] {
  const counts = new Map<string, number>();
  for (const lead of all) {
    const key = normalizePhone(lead.phone);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return leads.map((lead) => ({ ...lead, isDuplicate: (counts.get(normalizePhone(lead.phone)) ?? 0) > 1 }));
}

function clean(input: LeadInput) {
  const optional = (value: string) => value.trim() || null;
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: optional(input.email)?.toLowerCase() ?? null,
    occupation: optional(input.occupation),
    project: optional(input.project),
    status: input.status.trim(),
    source: input.source,
    budget: optional(input.budget),
    city: optional(input.city),
    state: optional(input.state),
    assignedTo: optional(input.assignedTo),
    address: optional(input.address),
    notes: optional(input.notes),
  };
}

const delay = () => new Promise((resolve) => setTimeout(resolve, 150));

function notFound(): never {
  throw Object.assign(new Error("Lead not found."), { status: 404 });
}

export const leadsApi = {
  async list(query: LeadQuery): Promise<LeadListResult> {
    await delay();
    const all = read();
    const search = query.search?.trim().toLowerCase() ?? "";
    const digits = search.replace(/\D/g, "");
    const from = query.from ? Date.parse(query.from) : null;
    const to = query.to ? Date.parse(query.to) : null;

    const matches = all
      .filter((lead) => !query.status || sameStatus(lead.status, query.status))
      .filter((lead) => (from === null || Date.parse(lead.createdAt) >= from) && (to === null || Date.parse(lead.createdAt) <= to))
      .filter((lead) =>
        !search ||
        lead.name.toLowerCase().includes(search) ||
        (lead.project ?? "").toLowerCase().includes(search) ||
        (digits.length >= 3 && normalizePhone(lead.phone).includes(digits)),
      )
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    const start = (query.page - 1) * query.limit;
    return {
      leads: withDuplicates(all, matches.slice(start, start + query.limit)),
      total: matches.length,
      page: query.page,
      limit: query.limit,
    };
  },

  /** Headline numbers for the Leads page. `todayStart` is the viewer's local midnight. */
  async stats(todayStart: string): Promise<LeadStats> {
    await delay();
    const all = read();
    const today = Date.parse(todayStart);
    const weekAgo = today - 6 * DAY_MS; // today plus the 6 days before it
    const created = (lead: StoredLead) => Date.parse(lead.createdAt);
    const isConverted = (lead: StoredLead) => sameStatus(lead.status, CONVERTED_STATUS);
    const isOpen = (lead: StoredLead) => !isConverted(lead) && !sameStatus(lead.status, DEAD_STATUS);
    const budget = (lead: StoredLead) => parseBudget(lead.budget) ?? 0;

    const openLeads = all.filter(isOpen);
    const convertedLeads = all.filter(isConverted);
    const createdPerDay = dailySeries(today, all, created, () => 1);
    const newToday = createdPerDay[TREND_DAYS - 1];
    const newYesterday = createdPerDay[TREND_DAYS - 2];

    return {
      total: {
        value: all.length,
        change: all.filter((lead) => created(lead) >= weekAgo).length,
        trend: dailySeries(today, all, created, () => 1, true),
      },
      newToday: { value: newToday, change: newToday - newYesterday, trend: createdPerDay },
      pipelineValue: {
        value: openLeads.reduce((sum, lead) => sum + budget(lead), 0),
        change: openLeads.filter((lead) => created(lead) >= weekAgo).reduce((sum, lead) => sum + budget(lead), 0),
        trend: dailySeries(today, openLeads, created, budget, true),
      },
      converted: {
        value: convertedLeads.length,
        change: convertedLeads.filter((lead) => Date.parse(lead.updatedAt) >= weekAgo).length,
        trend: dailySeries(today, convertedLeads, (lead) => Date.parse(lead.updatedAt), () => 1),
      },
    };
  },

  async create(input: LeadInput): Promise<Lead> {
    await delay();
    const all = read();
    const now = new Date().toISOString();
    const lead: StoredLead = { id: crypto.randomUUID(), ...clean(input), createdAt: now, updatedAt: now };
    const next = [lead, ...all];
    write(next);
    return withDuplicates(next, [lead])[0];
  },

  async update(id: string, input: LeadInput): Promise<Lead> {
    await delay();
    const all = read();
    const existing = all.find((lead) => lead.id === id) ?? notFound();
    const updated: StoredLead = { ...existing, ...clean(input), updatedAt: new Date().toISOString() };
    const next = all.map((lead) => (lead.id === id ? updated : lead));
    write(next);
    return withDuplicates(next, [updated])[0];
  },

  async remove(ids: string[]): Promise<void> {
    await delay();
    const remove = new Set(ids);
    write(read().filter((lead) => !remove.has(lead.id)));
  },
};

const STATUS_STORAGE_KEY = "crm.mock-lead-statuses";

function readStatuses(): LeadStatusOption[] {
  try {
    const saved = window.localStorage.getItem(STATUS_STORAGE_KEY);
    if (saved) return JSON.parse(saved) as LeadStatusOption[];
  } catch {
    // Fall back to the defaults below.
  }
  const initial = DEFAULT_LEAD_STATUSES.map((name) => ({ id: name.toLowerCase(), name }));
  writeStatuses(initial);
  return initial;
}

function writeStatuses(statuses: LeadStatusOption[]) {
  try {
    window.localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(statuses));
  } catch {
    // Storage full or blocked: changes last until reload.
  }
}

const SOURCE_STORAGE_KEY = "crm.mock-lead-sources";

function readSources(): LeadSourceOption[] {
  try {
    const saved = window.localStorage.getItem(SOURCE_STORAGE_KEY);
    if (saved) return JSON.parse(saved) as LeadSourceOption[];
  } catch {
    // Fall back to defaults below.
  }
  const initial = LEAD_SOURCES.map((s) => ({ value: s.value, label: s.label }));
  writeSources(initial);
  return initial;
}

function writeSources(sources: LeadSourceOption[]) {
  try {
    window.localStorage.setItem(SOURCE_STORAGE_KEY, JSON.stringify(sources));
  } catch {
    // Storage full or blocked.
  }
}

/** MOCK lead-source API: the account's own list of sources, which users can add to. */
export const leadSourcesApi = {
  async list(): Promise<LeadSourceOption[]> {
    await delay();
    return readSources();
  },

  /** Adds a source, or returns the existing one when the label is already taken (any case). */
  async create(label: string): Promise<LeadSourceOption> {
    await delay();
    const trimmed = label.trim().replace(/\s+/g, " ");
    if (trimmed.length < 1 || trimmed.length > 40) {
      throw Object.assign(new Error("Source names must be 1 to 40 characters."), { status: 400 });
    }
    const sources = readSources();
    const existing = sources.find((s) => s.label.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;
    const source: LeadSourceOption = { value: trimmed, label: trimmed };
    writeSources([...sources, source]);
    return source;
  },
};

/** MOCK lead-status API: the account's own list of statuses, which users can add to. */
export const leadStatusesApi = {
  async list(): Promise<LeadStatusOption[]> {
    await delay();
    return readStatuses();
  },

  /** Adds a status, or returns the existing one when the name is already taken (any case). */
  async create(name: string): Promise<LeadStatusOption> {
    await delay();
    const trimmed = name.trim().replace(/\s+/g, " ");
    if (trimmed.length < 1 || trimmed.length > 40) {
      throw Object.assign(new Error("Status names must be 1 to 40 characters."), { status: 400 });
    }
    const statuses = readStatuses();
    const existing = statuses.find((status) => sameStatus(status.name, trimmed));
    if (existing) return existing;
    const status = { id: crypto.randomUUID(), name: trimmed };
    writeStatuses([...statuses, status]);
    return status;
  },
};
