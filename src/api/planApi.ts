import { Plan } from '@/types/plan';
import api from './axios';

export const getPlans = async (): Promise<Plan[]> => {
  const res = await api.get('/api/plans/all');
  return res.data;
};

export const createPlan = async (data: Omit<Plan, 'id'>) => {
  return api.post('/api/plans/create', data);
};

export const updatePlan = async (id: number, data: Partial<Omit<Plan, 'id'>>) => {
  return api.patch(`/api/plans/${id}`, data);
};

export const deletePlan = async (id: number) => {
  return api.delete(`/api/plans/${id}`);
};
