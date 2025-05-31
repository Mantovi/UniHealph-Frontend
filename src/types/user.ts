export type UserRole = 'STUDENT' | 'UNIVERSITY' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: UserRole;
  universityId: number | null;
  points: number;
  createdAt: string;
  updatedAt: string;
}
