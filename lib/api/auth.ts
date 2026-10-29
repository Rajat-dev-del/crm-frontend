import { apiRequest } from "@/lib/api/client";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export const authApi = {
  register(input: RegisterInput) {
    return apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  login(input: LoginInput) {
    return apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
