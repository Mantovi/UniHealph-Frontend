import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { ProductType, ProductTypeRequest } from '@/types/productType';

export async function getProductTypes(): Promise<ProductType[]> {
  const res = await api.get<ApiResponse<ProductType[]>>('/api/product-types');
  return res.data.data!;
}

export async function createProductType(data: ProductTypeRequest): Promise<void> {
  await api.post('/api/product-types', data);
}

export async function updateProductType(id: number, data: ProductTypeRequest): Promise<void> {
  await api.patch(`/api/product-types/${id}`, data);
}

export async function deleteProductType(id: number): Promise<void> {
  await api.delete(`/api/product-types/${id}`);
}