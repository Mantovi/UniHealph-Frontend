import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { DirectPurchase } from '@/types/directPurchase';
import type { OrderResponse } from '@/types/order';

export async function checkoutItem(productId: number): Promise<ApiResponse<OrderResponse>> {
  const res = await api.post<ApiResponse<OrderResponse>>(
    `/api/orders/checkout-item?cartItemId=${productId}`
  );

  return res.data;
}

export async function directPurchase(data: DirectPurchase): Promise<ApiResponse<OrderResponse>> {
  const res = await api.post<ApiResponse<OrderResponse>>('/api/orders/direct-purchase', data);

  return res.data;
}

export async function checkoutCart(selectedProductIds: number[], pointsToUse: number): Promise<ApiResponse<OrderResponse>> {
  const res = await api.post<ApiResponse<OrderResponse>>(
    `/api/orders/checkout?pointsToUse=${pointsToUse}`,
    selectedProductIds
  );

  return res.data;
}

export async function getOrders(): Promise<OrderResponse[]> {
  const res = await api.get<ApiResponse<OrderResponse[]>>('/api/orders/list');

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao buscar pedidos');
  }

  return res.data.data;
}
