export type SaleType =  'VENDA' | 'ALUGUEL';

export interface CartItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleType: SaleType;
  semesterCount: number | null;
}

export interface CartItemResponse {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleType: SaleType;
  semesterCount?: number | null;
  imageUrl?: string | null;
}