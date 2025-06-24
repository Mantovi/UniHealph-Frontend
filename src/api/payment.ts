import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { PaymentMethod, PaymentMethodRequest } from '@/types/payment';

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await api.get<ApiResponse<PaymentMethod[]>>('/api/payment-methods/all');
  return res.data.data!;
}

export async function createPaymentMethod(data: PaymentMethodRequest): Promise<void> {
  await api.post('/api/payment-methods', data);
}

export async function updatePaymentMethod(id: number, data: PaymentMethodRequest): Promise<void> {
  await api.patch(`/api/payment-methods/${id}`, data);
}

export async function deletePaymentMethod(id: number): Promise<void> {
  await api.delete(`/api/payment-methods/${id}`);
}
