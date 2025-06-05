import api from './axios';
import { Login, Register } from '../types/auth';
import { User } from '@/types/user';

export interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (data: Login): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao fazer login');
    console.error(error);
  }
};

export const register = async (data: Register) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.status === 200;
  } catch (error) {
    throw new Error('Erro ao registrar usuário');
    console.error(error);
  }
};