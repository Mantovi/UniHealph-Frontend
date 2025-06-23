import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { PointsBalance, PointsHistory, PointsType } from '@/types/points';

export async function getPointsBalance(): Promise<PointsBalance> {
  const res = await api.get<ApiResponse<PointsBalance>>('/api/points/balance');

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao buscar saldo de pontos');
  }

  return res.data.data;
}

export async function getPointsHistory(type?: PointsType): Promise<PointsHistory[]> {
  const res = await api.get<ApiResponse<PointsHistory[]>>('/api/points/history', {
    params: type ? { type } : {},
  });

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao buscar histórico de pontos');
  }

  return res.data.data;
}
