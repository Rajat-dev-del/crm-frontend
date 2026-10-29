export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  occupation: string | null;
  project: string | null;
  city: string | null;
  state: string | null;
  /** "lead": a lead whose status is Converted; "manual": added from the Customers page. */
  origin: "lead" | "manual";
  createdAt: string;
};

export type CustomerInput = {
  name: string;
  phone: string;
  email: string;
  occupation: string;
  project: string;
  city: string;
  state: string;
};

export type CustomerQuery = {
  search?: string;
  page: number;
  limit: number;
};

export type CustomerListResult = {
  customers: Customer[];
  total: number;
};
