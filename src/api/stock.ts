import api from './axios';
import type { ApiResponse } from '@/types/api';

export async function updateStockQuantity(productId: number, newQuantity: number): Promise<ApiResponse<null>> {
  const res = await api.put<ApiResponse<null>>('/api/stock/change-quantity', {
    productId,
    newQuantity,
  });

  return res.data;
}