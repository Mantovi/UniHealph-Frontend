import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { SubSpecialty, SubSpecialtyRequest } from '@/types/subspecialty';

export async function getSubSpecialties(): Promise<SubSpecialty[]> {
  const res = await api.get<ApiResponse<SubSpecialty[]>>('/api/sub-specialties');
  return res.data.data!;
}

export async function createSubSpecialty(data: SubSpecialtyRequest): Promise<ApiResponse<SubSpecialty>> {
  const res = await api.post('/api/sub-specialties', data);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao criar subespecialidade');
  }
  return res.data;
}

export async function updateSubSpecialty(id: number, data: SubSpecialtyRequest): Promise<ApiResponse<SubSpecialty>> {
  const res =await api.patch(`/api/sub-specialties/${id}`, data);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao atualizar subespecialidade');
  }
  return res.data;
}

export async function deleteSubSpecialty(id: number): Promise<void> {
  await api.delete(`/api/sub-specialties/${id}`);
}

export async function deactivateSubSpecialty(id: number): Promise<void> {
  await api.patch(`/api/sub-specialties/${id}/deactivate`);
}

export async function activateSubSpecialty(id: number): Promise<void> {
  await api.patch(`/api/sub-specialties/${id}/activate`);
}