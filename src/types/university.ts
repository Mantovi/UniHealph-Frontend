export interface UniversityResponse {
  id: number;
  name: string;
  email: string;
  cnpj: string;
  planName: string;
  paymentMethod: string;
  isActive: boolean;
}

export interface UniversityManagerResponse {
  name: string;
  email: string;
  cpf: string;
  phone: string;  
}

export interface PendingUniversityRequest {
  name: string;
  email: string;
  cnpj: string;
  planId: number;
  paymentMethodId: number;
  managerName: string;
  managerEmail: string;
  managerPassword: string;
  managerCpf: string;
  managerPhone: string;
}

export interface PendingUniversityResponse {
  id: number;
  name: string;
  email: string;
  cnpj: string;
  planName: string;
  paymentType: string;
  managerName: string;
  managerEmail: string;
  managerCpf: string;
  managerPhone: string;
  status: string;
  requestedAt: string;
}

export interface PermittedStudents {
  name: string;
  email: string;
  cpf: string;
}

export interface PermittedStudentsResponse {
  id: number;
  name: string;
  email: string;
  cpf: string;
  universityId: number;
}




