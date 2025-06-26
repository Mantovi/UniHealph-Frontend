import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { SubSpecialty, SubSpecialtyRequest } from '@/types/subspecialty';

export async function getSubSpecialties(): Promise<SubSpecialty[]> {
  const res = await api.get<ApiResponse<SubSpecialty[]>>('/api/sub-specialties');
  return res.data.data!;
}

export async function createSubSpecialty(data: SubSpecialtyRequest): Promise<void> {
  await api.post('/api/sub-specialties', data);
}

export async function updateSubSpecialty(id: number, data: SubSpecialtyRequest): Promise<void> {
  await api.patch(`/api/sub-specialties/${id}`, data);
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