import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { Plan, PlanRequest } from '@/types/plan';

export async function getPlans(): Promise<Plan[]> {
  const res = await api.get<ApiResponse<Plan[]>>('/api/plans/all');
  return res.data.data!;
}

export async function createPlan(data: PlanRequest): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>('/api/plans', data);
  return res.data;
}

export async function updatePlan(id: number, data: PlanRequest): Promise<ApiResponse<null>> {
  const res = await api.patch<ApiResponse<null>>(`/api/plans/${id}`, data);
  return res.data;
}


export async function deletePlan(id: number): Promise<void> {
  await api.delete(`/api/plans/${id}`);
}
