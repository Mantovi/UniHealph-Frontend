import api from './axios';
import type { UserResponse, UserUpdate } from '@/types/user';
import type { ApiResponse } from '@/types/api';
import type { UniversityResponse } from '@/types/university';

export async function getCurrentUser(): Promise<UserResponse> {
  const res = await api.get<ApiResponse<UserResponse>>
  ('/api/users/me');

  if (!res.data.success || !res.data.data) {
    throw new Error('Usuário não autenticado');
  }

  return res.data.data;
}

export async function updateCurrentUser(data: UserUpdate): Promise<UserResponse> {
  const res = await api.patch<ApiResponse<UserResponse>>
  ('/api/users/me/update', data);

  if (!res.data.success || !res.data.data) {
    throw new Error('Erro ao atualizar usuário');
  }
  
  return res.data.data;
}
export async function getUniversityInfo(): Promise<UniversityResponse> {
  const res = await api.get<ApiResponse<UniversityResponse>>(
    '/api/university/university-management/info'
  );

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao obter universidade');
  }

  return res.data.data;
}