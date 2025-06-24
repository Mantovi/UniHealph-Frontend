import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { Category, CategoryRequest } from '@/types/category';

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<ApiResponse<Category[]>>('/api/categories');
  return res.data.data!;
}

export async function createCategory(data: CategoryRequest): Promise<void> {
  await api.post('/api/categories', data);
}

export async function updateCategory(id: number, data: CategoryRequest): Promise<void> {
  await api.patch(`/api/categories/${id}`, data);
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/api/categories/${id}`);
}