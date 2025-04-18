import { createContext } from 'react';
import { JwtPayload } from '@/types/auth';

type AuthContextType = {
  user: JwtPayload | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
