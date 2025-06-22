export interface RentalResponse {
  id: number;
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  semesterCount: number;
  status: RentalStatus;
  rentedAt: string;
  expectedReturn: string;
  returnedAt: string;
}


export type RentalStatus = 'AGUARDANDO_RETIRADA' | 'EM_USO' | 'DEVOLVIDO' | 'ATRASADO' | 'DANIFICADO';