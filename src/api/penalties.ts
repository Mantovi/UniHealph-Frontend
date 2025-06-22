import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { PenaltyResponse } from '@/types/penalty';

export async function getMyPenalties(): Promise<PenaltyResponse[]> {
  const res = await api.get<ApiResponse<PenaltyResponse[]>>('/api/penalties/my');

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar penalidades');
  }

  return res.data.data;
}

export async function payPenalty(id: number): Promise<void> {
  const res = await api.put<ApiResponse<null>>(`/api/penalties/${id}/pay`);

  if (!res.data.success) {
    throw new Error(res.data.message ?? 'Erro ao pagar multa');
  }
}