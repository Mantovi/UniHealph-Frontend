import api from './axios';
import { User } from '@/types/user';

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/api/users/me', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};


export const updateCurrentUser = async (data: {
  name?: string;
  phone?: string;
  password?: string;
}): Promise<User> => {
  const response = await api.patch('/api/users/me', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};
