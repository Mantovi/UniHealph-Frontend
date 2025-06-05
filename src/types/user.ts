export type UserRole = 'STUDENT' | 'UNIVERSITY' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: 'STUDENT' | 'UNIVERSITY' | 'ADMIN';
  universityId: number | null;
  universityName?: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

