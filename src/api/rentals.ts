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

export async function getRentalsByStatus(status: string): Promise<RentalResponse[]> {
  const res = await api.get<ApiResponse<RentalResponse[]>>(`/api/rentals/status/${status}`);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar aluguéis');
  }
  return res.data.data;
}

export async function updateRentalStatus(id: number, status: string): Promise<ApiResponse<null>> {
  const res = await api.put<ApiResponse<null>>(`/api/rentals/${id}/status`, null, { params: { status } });
  return res.data;
}
