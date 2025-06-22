import type { UserResponse } from "./user";

export interface AuthRequest {
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}
