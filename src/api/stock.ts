import api from './axios';
import type { ApiResponse } from '@/types/api';

export async function updateStockQuantity(productId: number, newQuantity: number): Promise<void> {
  const res = await api.put<ApiResponse<null>>('/api/stock/change-quantity', {
    productId,
    newQuantity,
  });

  if (!res.data.success) {
    throw new Error(res.data.message ?? 'Erro ao atualizar estoque');
  }
}