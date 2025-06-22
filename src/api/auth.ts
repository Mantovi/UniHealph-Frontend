import api from './axios';
import type {  AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import type { ApiResponse } from '../types/api';

export async function login(data: LoginRequest) {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
  return res.data.data;
}

export async function register(data: RegisterRequest) {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
  return res.data;
}