export type Property = {
  id: string;
  name: string;
  type: string;
  location: string | null;
  createdAt: string;
};

export type PropertyInput = {
  name: string;
  type: string;
  location: string;
};

export type PropertyQuery = {
  search?: string;
  page: number;
  limit: number;
};

export type PropertyListResult = {
  properties: Property[];
  total: number;
};
