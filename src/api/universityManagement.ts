import api from './axios';
import type { ApiResponse } from '@/types/api';

export async function changePlan(universityId: number, newPlanId: number): Promise<void> {
  const res = await api.put<ApiResponse<null>>(
    `/api/university/university-management/${universityId}/change-plan?newPlanId=${newPlanId}`
  );

  if (!res.data.success) {
    throw new Error(res.data.message ?? 'Erro ao alterar plano');
  }
}

export async function changePaymentMethod(
  universityId: number,
  newPaymentMethodId: number
): Promise<void> {
  const res = await api.put<ApiResponse<null>>(
    `/api/university/university-management/${universityId}/change-payment-method?newPaymentMethodId=${newPaymentMethodId}`
  );

  if (!res.data.success) {
    throw new Error(res.data.message ?? 'Erro ao alterar forma de pagamento');
  }
}

export async function cancelUniversityAccess(universityId: number): Promise<void> {
  await api.delete(`/api/university/university-management/${universityId}/cancel-access`);
}