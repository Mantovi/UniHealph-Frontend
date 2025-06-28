import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { Category, CategoryRequest } from '@/types/category';

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<ApiResponse<Category[]>>('/api/categories');
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar categorias');
  }
  return res.data.data!;
}

export async function createCategory(data: CategoryRequest): Promise<ApiResponse<Category>> {
  const res = await api.post('/api/categories', data);
    if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar categorias');
  }

  return res.data;
}

export async function updateCategory(id: number, data: CategoryRequest): Promise<ApiResponse<Category>> {
  const res = await api.patch(`/api/categories/${id}`, data);
    if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar categorias');
  }

  return res.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/api/categories/${id}`);
}

export async function deactivateCategory(id: number): Promise<void> {
  await api.patch(`/api/categories/${id}/deactivate`);
}

export async function activateCategory(id: number): Promise<void> {
  await api.patch(`/api/categories/${id}/activate`);
}