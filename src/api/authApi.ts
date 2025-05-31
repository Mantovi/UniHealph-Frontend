import api from './axios';

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao fazer login');
    console.error(error);
  }
};

// src/api/authApi.ts
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone: string;
}

export const register = async (data: RegisterRequest) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.status === 200;
  } catch (error) {
    throw new Error('Erro ao registrar usuário');
    console.error(error);
  }
};

