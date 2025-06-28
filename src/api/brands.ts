import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { Brand, BrandRequest } from '@/types/brand';

export async function getBrands(): Promise<Brand[]> {
  const res = await api.get<ApiResponse<Brand[]>>('/api/brands');
  return res.data.data!;
}

export async function createBrand(data: BrandRequest): Promise<ApiResponse<Brand>> {
  const res = await api.post<ApiResponse<Brand>>('/api/brands', data);
  return res.data;
}

export async function updateBrand(id: number, data: BrandRequest): Promise<ApiResponse<Brand>> {
  const res = await api.patch<ApiResponse<Brand>>(`/api/brands/${id}`, data);
  return res.data;
}

export async function deleteBrand(id: number): Promise<void> {
  await api.delete(`/api/brands/${id}`);
}