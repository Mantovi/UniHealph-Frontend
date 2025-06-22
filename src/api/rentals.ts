import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { RentalResponse } from '@/types/rental';

export async function getMyRentals(): Promise<RentalResponse[]> {
  const res = await api.get<ApiResponse<RentalResponse[]>>('/api/rentals/my');

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar aluguéis');
  }

  return res.data.data;
}