import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { CartItemResponse } from '@/types/cart';


export async function addToCart(data: {
  productId: number;
  quantity: number;
  semesterCount?: number;
}): Promise<void> {
  await api.post<ApiResponse<null>>('/api/cart/add', null, {
    params: data,
  });
}

export async function getCartItems(): Promise<CartItemResponse[]> {
  const res = await api.get<ApiResponse<CartItemResponse[]>>('/api/cart/items');

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar itens do carrinho');
  }

  return res.data.data;
}

export async function getCartTotal(): Promise<number> {
  const res = await api.get<ApiResponse<number>>('/api/cart/total');

  if (!res.data.success || res.data.data === null) {
    throw new Error(res.data.message ?? 'Erro ao calcular total');
  }

  return res.data.data;
}

export async function updateCartItem(data: {
  productId: number;
  quantity: number;
  semesterCount?: number;
}): Promise<void> {
  await api.put('/api/cart/update', null, { params: data });
}

export async function removeCartItem(productId: number): Promise<void> {
  await api.delete('/api/cart/remove', { params: { productId } });
}
