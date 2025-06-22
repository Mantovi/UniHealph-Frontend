import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { SpecialtyTree } from '@/types/specialtyTree';

export async function getSpecialtyTree(): Promise<SpecialtyTree[]> {
  const res = await api.get<ApiResponse<SpecialtyTree[]>>('/api/specialties/tree');

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao carregar a árvore de categorias');
  }

  return res.data.data;
}
