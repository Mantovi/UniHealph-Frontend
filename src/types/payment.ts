export interface PaymentMethod {
  id: number;
  type: string;
  description: string;
}

export interface PaymentMethodRequest {
  type: string;
  description: string;
}