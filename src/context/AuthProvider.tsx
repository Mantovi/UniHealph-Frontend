import { useState, useEffect, ReactNode } from 'react';
import { JwtPayload } from '@/types/auth';
import { authService } from '@/services/authService';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser(decoded);
      } catch {
        authService.logout();
      }
    }
  }, []);

  const login = (token: string) => {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('token', token);
    setUser(decoded);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
