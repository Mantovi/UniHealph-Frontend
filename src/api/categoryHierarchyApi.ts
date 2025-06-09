import api from './axios';
import { Specialty } from '@/types/categoryHierarchy';

export const fetchSpecialties = async (): Promise<Specialty[]> => {
  const res = await api.get('/api/specialties');
  return res.data;
};
