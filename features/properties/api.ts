import type { Property, PropertyInput, PropertyListResult, PropertyQuery } from "@/features/properties/types";
import { mockCollection, mockDelay } from "@/lib/mock/collection";

/**
 * MOCK properties API backed by localStorage. Keep these signatures when switching to
 * `apiRequest(..., { authenticated: true })` calls.
 */
const store = mockCollection<Property>("crm.mock-properties", () => {
  // SAMPLE rows shown the first time.
  const at = (daysAgo: number) => new Date(Date.now() - daysAgo * 86_400_000).toISOString();
  return [
    { id: "sample-rosewood", name: "Rosewood Vista", type: "Apartment", location: "Bengaluru", createdAt: at(4) },
    { id: "sample-skyline", name: "Skyline Residency", type: "Villa", location: "Hyderabad", createdAt: at(3) },
    { id: "sample-greenfield", name: "Greenfield Heights", type: "Plot", location: "Pune", createdAt: at(2) },
    { id: "sample-horizon", name: "Horizon Square", type: "Commercial", location: "Mumbai", createdAt: at(1) },
  ];
});

export const propertiesApi = {
  /** Paginated property list, newest first, optionally filtered by search. */
  async list(query: PropertyQuery): Promise<PropertyListResult> {
    await mockDelay();
    const search = query.search?.trim().toLowerCase() ?? "";
    const all = [...store.read()]
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .filter(
        (p) =>
          !search ||
          p.name.toLowerCase().includes(search) ||
          (p.location ?? "").toLowerCase().includes(search) ||
          p.type.toLowerCase().includes(search),
      );
    const start = (query.page - 1) * query.limit;
    return { properties: all.slice(start, start + query.limit), total: all.length };
  },

  async create(input: PropertyInput): Promise<Property> {
    await mockDelay();
    const name = input.name.trim();
    const all = store.read();
    if (all.some((property) => property.name.toLowerCase() === name.toLowerCase())) {
      throw Object.assign(new Error("A property with this name already exists."), { status: 409 });
    }
    const property: Property = {
      id: crypto.randomUUID(),
      name,
      type: input.type,
      location: input.location.trim() || null,
      createdAt: new Date().toISOString(),
    };
    store.write([property, ...all]);
    return property;
  },
};
