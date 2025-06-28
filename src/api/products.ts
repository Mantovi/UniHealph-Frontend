import api from './axios';
import type { ProductResponse, ProductSearchParams, ProductCreate, ProductUpdate } from '@/types/product';
import type { ApiResponse } from '@/types/api';
import type { Brand } from '@/types/brand';

export async function getAllProducts(): Promise<ProductResponse[]> {
  const res = await api.get<ApiResponse<ProductResponse[]>>('/api/products');

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar produtos');
  }

  return res.data.data;
}

export async function getAllBrands(): Promise<Brand[]> {
  const res = await api.get<ApiResponse<Brand[]>>('/api/brands');

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar marcas');
  }

  return res.data.data;
}

export async function searchProducts(params: ProductSearchParams): Promise<ProductResponse[]> {
  const query = new URLSearchParams();

  if (params.q) query.append('q', params.q);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.direction) query.append('direction', params.direction);
  if (params.saleType) query.append('saleType', params.saleType);

  params.brandIds?.forEach(id => query.append('brandIds', String(id)));
  params.productTypeIds?.forEach(id => query.append('productTypeIds', String(id)));

  if (params.categoryId) query.append('categoryId', String(params.categoryId));
  if (params.subSpecialtyId) query.append('subSpecialtyId', String(params.subSpecialtyId));
  if (params.specialtyId) query.append('specialtyId', String(params.specialtyId));
  if (params.minPrice) query.append('minPrice', String(params.minPrice));
  if (params.maxPrice) query.append('maxPrice', String(params.maxPrice));

  const res = await api.get<ApiResponse<ProductResponse[]>>(`/api/products/search?${query.toString()}`);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao buscar produtos');
  }

  return res.data.data;
}

export async function getProductById(id: number): Promise<ProductResponse> {
  const res = await api.get<ApiResponse<ProductResponse>>(`/api/products/${id}`);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Produto não encontrado');
  }

  return res.data.data;
}

export async function getRelatedProducts(productTypeId: number): Promise<ProductResponse[]> {
  const res = await api.get<ApiResponse<ProductResponse[]>>('/api/products/search', {
    params: {
      productTypeIds: [productTypeId],
      sortBy: 'rating',
      direction: 'desc',
    },
  });

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao buscar produtos relacionados');
  }

  return res.data.data;
}

export async function createProduct(data: ProductCreate): Promise<ApiResponse<ProductResponse>> {
  const res = await api.post<ApiResponse<ProductResponse>>('/api/products', data);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao criar produto');
  }

  return res.data;
}

export async function updateProduct(id: number, data: ProductUpdate): Promise<ApiResponse<ProductResponse>> {
  const res = await api.patch<ApiResponse<ProductResponse>>(`/api/products/${id}`, data);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao atualizar produto');
  }

  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/api/products/${id}`);
}

export async function deactivateProduct(id: number): Promise<void> {
  await api.patch(`/api/products/${id}/deactivate`);
}

export async function activateProduct(id: number): Promise<void> {
  await api.patch(`/api/products/${id}/activate`);
}
