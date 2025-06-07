import { PaymentMethod } from '@/types/paymentMethod';
import api from './axios';

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const res = await api.get('/api/payment-methods/all');
  return res.data;
};

export const createPaymentMethod = async (data: Omit<PaymentMethod, 'id'>) => {
  return api.post('/api/payment-methods/create', data);
};

export const updatePaymentMethod = async (
  id: number,
  data: Partial<Omit<PaymentMethod, 'id'>>
) => {
  return api.patch(`/api/payment-methods/${id}`, data);
};

export const deletePaymentMethod = async (id: number) => {
  return api.delete(`/api/payment-methods/${id}`);
};
