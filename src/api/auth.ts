// src/api/auth.ts

import api from './axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || 'Erro ao fazer login');
  }
  return res.data.data;
}

export async function register(data: RegisterRequest): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>('/auth/register', data);
  // Retorne a resposta completa para a página poder pegar o message
  return res.data;
}
