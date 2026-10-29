/** Name of a user-defined status, e.g. "Converted" or "Hot". */
export type LeadStatus = string;

/** An entry in the account's list of lead statuses. */
export type LeadStatusOption = {
  id: string;
  name: string;
};

export type LeadSource = string;

/** An entry in the account's list of lead sources. */
export type LeadSourceOption = { value: string; label: string };

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  occupation: string | null;
  project: string | null;
  status: LeadStatus;
  source: LeadSource;
  budget: string | null;
  city: string | null;
  state: string | null;
  assignedTo: string | null;
  address: string | null;
  notes: string | null;
  /** True when another lead has the same phone number. */
  isDuplicate: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Values sent when creating or updating a lead. Empty strings clear optional fields. */
export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  occupation: string;
  project: string;
  status: LeadStatus;
  source: LeadSource;
  budget: string;
  city: string;
  state: string;
  assignedTo: string;
  address: string;
  notes: string;
};

export type LeadQuery = {
  /** Status name to match; empty for all statuses. */
  status: string;
  /** ISO timestamps (inclusive). */
  from?: string;
  to?: string;
  search?: string;
  page: number;
  limit: number;
};

export type LeadListResult = {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
};

/** One headline number with its change and a daily series for the sparkline. */
export type LeadMetric = {
  value: number;
  /** Change over the comparison period (see each field). */
  change: number;
  /** One point per day, oldest first, ending today. */
  trend: number[];
};

export type LeadStats = {
  /** All leads; change = leads created in the last 7 days; trend = running total. */
  total: LeadMetric;
  /** Leads created today; change = today minus yesterday; trend = leads created per day. */
  newToday: LeadMetric;
  /** Rupee budget of open leads (not converted or dead); change = added in the last 7 days. */
  pipelineValue: LeadMetric;
  /** Leads with the converted status; change = converted in the last 7 days (by last update). */
  converted: LeadMetric;
};
