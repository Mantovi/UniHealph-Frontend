import { createContext } from 'react';
import { JwtPayload } from '@/types/auth';

type AuthContext = {
  user: JwtPayload | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContext | undefined>(undefined);
