// src/hooks/useAuth.ts
import { useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = (jwtToken: string) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return { token, login, logout };
};
