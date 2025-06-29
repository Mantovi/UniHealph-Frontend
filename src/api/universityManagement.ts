import api from './axios';
import type { ApiResponse } from '@/types/api';

export async function changePlan(universityId: number, newPlanId: number): Promise<ApiResponse<null>> {
  const res = await api.put<ApiResponse<null>>(
    `/api/university/university-management/${universityId}/change-plan?newPlanId=${newPlanId}`
  );

  return res.data;
}

export async function changePaymentMethod(
  universityId: number,
  newPaymentMethodId: number
): Promise<ApiResponse<null>> {
  const res = await api.put<ApiResponse<null>>(
    `/api/university/university-management/${universityId}/change-payment-method?newPaymentMethodId=${newPaymentMethodId}`
  );

  return res.data;
}

export async function cancelUniversityAccess(universityId: number): Promise<void> {
  await api.delete(`/api/university/university-management/${universityId}/cancel-access`);
}