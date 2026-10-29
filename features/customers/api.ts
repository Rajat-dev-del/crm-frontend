import type { Customer, CustomerInput, CustomerListResult, CustomerQuery } from "@/features/customers/types";
import { leadsApi, normalizePhone } from "@/features/leads/api";
import { CONVERTED_STATUS } from "@/features/leads/constants";
import type { Lead } from "@/features/leads/types";
import { mockCollection, mockDelay } from "@/lib/mock/collection";

/**
 * MOCK customers API. Customers = customers added on this page + every lead whose status is
 * "Converted" (so converting a lead makes it appear here automatically). The real backend should
 * return the same combined list from one endpoint.
 */
type StoredCustomer = Omit<Customer, "origin">;

const store = mockCollection<StoredCustomer>("crm.mock-customers", () => []);

function fromLead(lead: Lead): Customer {
  return {
    id: `lead-${lead.id}`,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    occupation: lead.occupation,
    project: lead.project,
    city: null,
    state: lead.state,
    origin: "lead",
    createdAt: lead.createdAt,
  };
}

export const customersApi = {
  async list(query: CustomerQuery): Promise<CustomerListResult> {
    const [converted] = await Promise.all([
      leadsApi.list({ status: CONVERTED_STATUS, page: 1, limit: Number.MAX_SAFE_INTEGER }),
      mockDelay(),
    ]);
    const manual = store.read().map((customer): Customer => ({ ...customer, origin: "manual" }));
    const search = query.search?.trim().toLowerCase() ?? "";
    const digits = search.replace(/\D/g, "");

    const all = [...manual, ...converted.leads.map(fromLead)]
      .filter((customer) =>
        !search ||
        customer.name.toLowerCase().includes(search) ||
        (customer.email ?? "").includes(search) ||
        (customer.project ?? "").toLowerCase().includes(search) ||
        (customer.city ?? "").toLowerCase().includes(search) ||
        (digits.length >= 3 && normalizePhone(customer.phone).includes(digits)),
      )
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    const start = (query.page - 1) * query.limit;
    return { customers: all.slice(start, start + query.limit), total: all.length };
  },

  async create(input: CustomerInput): Promise<Customer> {
    await mockDelay();
    const optional = (value: string) => value.trim() || null;
    const customer: StoredCustomer = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: optional(input.email)?.toLowerCase() ?? null,
      occupation: optional(input.occupation),
      project: optional(input.project),
      city: optional(input.city),
      state: optional(input.state),
      createdAt: new Date().toISOString(),
    };
    store.write([customer, ...store.read()]);
    return { ...customer, origin: "manual" };
  },
};
