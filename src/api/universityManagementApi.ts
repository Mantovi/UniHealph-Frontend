import api from './axios';
import { UniversityResponse } from '@/types/university';

export const getUniversityInfo = async (): Promise<UniversityResponse> => {
  const response = await api.get('/api/universities/me', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const changeUniversityPlan = async (universityId: number, newPlanId: number) => {
  await api.put(`/api/university/university-management/${universityId}/change-plan`, null, {
    params: { newPlanId },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const changeUniversityPaymentMethod = async (universityId: number, newPaymentMethodId: number) => {
  await api.put(`/api/university/university-management/${universityId}/change-payment-method`, null, {
    params: { newPaymentMethodId },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const cancelUniversityAccess = async (universityId: number) => {
  await api.delete(`/api/university/university-management/${universityId}/cancel-access`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
