import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { DirectPurchase } from '@/types/directPurchase';
import type { OrderResponse } from '@/types/order';

export async function checkoutItem(productId: number): Promise<OrderResponse> {
  const res = await api.post<ApiResponse<OrderResponse>>(
    `/api/orders/checkout-item?cartItemId=${productId}`
  );

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao finalizar pedido');
  }

  return res.data.data;
}

export async function directPurchase(data: DirectPurchase): Promise<OrderResponse> {
  const res = await api.post<ApiResponse<OrderResponse>>('/api/orders/direct-purchase', data);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao finalizar compra direta');
  }

  return res.data.data;
}

export async function checkoutCart(selectedProductIds: number[], pointsToUse: number): Promise<OrderResponse> {
  const res = await api.post<ApiResponse<OrderResponse>>(
    `/api/orders/checkout?pointsToUse=${pointsToUse}`,
    selectedProductIds
  );

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao finalizar compra');
  }

  return res.data.data;
}

export async function getOrders(): Promise<OrderResponse[]> {
  const res = await api.get<ApiResponse<OrderResponse[]>>('/api/orders/list');

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao buscar pedidos');
  }

  return res.data.data;
}
