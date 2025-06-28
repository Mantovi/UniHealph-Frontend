import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { Specialty, SpecialtyRequest } from '@/types/specialty';

export async function getSpecialties(): Promise<Specialty[]> {
  const res = await api.get<ApiResponse<Specialty[]>>('/api/specialties');
  return res.data.data!;
}

export async function createSpecialty(data: SpecialtyRequest): Promise<ApiResponse<Specialty>> {
  const res = await api.post('/api/specialties', data);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao criar especialidade');
  }

  return res.data;
}

export async function updateSpecialty(id: number, data: SpecialtyRequest): Promise<ApiResponse<Specialty>>  {
  const res =await api.patch(`/api/specialties/${id}`, data);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao atualizar especialidade');
  }
  return res.data;
}

export async function deleteSpecialty(id: number): Promise<void> {
  await api.delete(`/api/specialties/${id}`);
}

export async function deactivateSpecialty(id: number): Promise<void> {
  await api.patch(`/api/specialties/${id}/deactivate`);
}

export async function activateSpecialty(id: number): Promise<void> {
  await api.patch(`/api/specialties/${id}/activate`);
}
