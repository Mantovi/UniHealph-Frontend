import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { Brand, BrandRequest } from '@/types/brand';

export async function getBrands(): Promise<Brand[]> {
  const res = await api.get<ApiResponse<Brand[]>>('/api/brands');
  return res.data.data!;
}

export async function createBrand(data: BrandRequest): Promise<void> {
  await api.post('/api/brands', data);
}

export async function updateBrand(id: number, data: BrandRequest): Promise<void> {
  await api.patch(`/api/brands/${id}`, data);
}

export async function deleteBrand(id: number): Promise<void> {
  await api.delete(`/api/brands/${id}`);
}