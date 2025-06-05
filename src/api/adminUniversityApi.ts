import api from './axios';
import { PendingUniversityResponse } from '../types/university';

export const getUniversityRequests = async (): Promise<PendingUniversityResponse[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/admin/university-requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter solicitações de universidades');
    console.error(error);
  }
};


export const approveUniversityRequest = async (id: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(`/api/admin/university-requests/${id}/approve`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao aprovar solicitação');
    console.error(error);
  }
};

export const rejectUniversityRequest = async (id: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(`/api/admin/university-requests/${id}/reject`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao rejeitar solicitação');
    console.error(error);
  }
};
