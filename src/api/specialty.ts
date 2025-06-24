import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { Specialty, SpecialtyRequest } from '@/types/specialty';

export async function getSpecialties(): Promise<Specialty[]> {
  const res = await api.get<ApiResponse<Specialty[]>>('/api/specialties');
  return res.data.data!;
}

export async function createSpecialty(data: SpecialtyRequest): Promise<void> {
  await api.post('/api/specialties', data);
}

export async function updateSpecialty(id: number, data: SpecialtyRequest): Promise<void> {
  await api.patch(`/api/specialties/${id}`, data);
}

export async function deleteSpecialty(id: number): Promise<void> {
  await api.delete(`/api/specialties/${id}`);
}