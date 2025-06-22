export type SaleType =  'VENDA' | 'ALUGUEL';

export type OrderStatus = 'PENDENTE' | 'VENDIDO' | 'EM_USO' | 'DEVOLVIDO' | 'ATRASADO' | 'DANIFICADO';


export interface OrderItem {
  productId: number;
  productName: string;
  salesType: SaleType;
  quantity: number;
  semesterCount: number | null;
  unitPrice: number;
  totalPrice: number;
  state: string;
  expectedReturn?: string;
}

export interface OrderResponse {
  orderId: number;
  orderStatus: OrderStatus;
  finalPrice: number;
  pointsUsed: number;
  pointsEarned: number;
  createdAt: string;
  items: OrderItem[];
}

