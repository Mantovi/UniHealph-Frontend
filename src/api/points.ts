import type { PointsBalance } from '@/types/points';
import api from './axios';
import type { ApiResponse } from '@/types/api';

export async function getPointsBalance(): Promise<PointsBalance> {
  const res = await api.get<ApiResponse<PointsBalance>>('/api/points/balance');

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar saldo de pontos');
  }

  return res.data.data;
}
