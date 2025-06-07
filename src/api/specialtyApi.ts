import { Specialty } from '@/types/specialty';
import api from './axios';

export const getAllSpecialties = async (): Promise<Specialty[]> => {
  const res = await api.get('/api/specialties');
  return res.data;
};
