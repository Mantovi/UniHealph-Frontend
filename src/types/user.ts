export type Role =  'ADMIN' | 'UNIVERSITY' | 'STUDENT';
export interface UserRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  role: Role;
  universityId: number;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: Role;
  universityId: number;
  universityName: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdate {
  name?: string;
  phone?: string;
  password?: string;
  currentPassword: string;
}