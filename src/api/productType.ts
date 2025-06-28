import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { ProductType, ProductTypeRequest } from '@/types/productType';

export async function getProductTypes(): Promise<ProductType[]> {
  const res = await api.get<ApiResponse<ProductType[]>>('/api/product-types');
  return res.data.data!;
}

export async function createProductType(data: ProductTypeRequest): Promise<ApiResponse<ProductType>> {
  const res =await api.post('/api/product-types', data);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao criar tipo de produto');
  }
  return res.data;
}

export async function updateProductType(id: number, data: ProductTypeRequest): Promise<ApiResponse<ProductType>> {
  const res = await api.patch(`/api/product-types/${id}`, data);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao atualizar tipo de produto');
  }
  return res.data;
}

export async function deleteProductType(id: number): Promise<void> {
  await api.delete(`/api/product-types/${id}`);
}

export async function deactivateProductType(id: number): Promise<void> {
  await api.patch(`/api/product-types/${id}/deactivate`);
}

export async function activateProductType(id: number): Promise<void> {
  await api.patch(`/api/product-types/${id}/activate`);
}