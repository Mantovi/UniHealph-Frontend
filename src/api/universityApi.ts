import api from './axios';

export const getPlans = async () => {
  try {
    const response = await api.get('/api/plans/all');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar planos');
    console.error(error);
  }
};

export const getPaymentMethods = async () => {
  try {
    const response = await api.get('/api/payment-methods/all');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar métodos de pagamento');
    console.error(error);
  }
};
