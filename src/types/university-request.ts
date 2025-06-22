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

export interface PendingUniversityRequestResponse {
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
