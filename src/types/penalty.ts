export interface PenaltyResponse {
  id: number;
  amount: number;
  reason: string;
  isPaid: boolean;
  createdAt: string;
  rentalId: number;
}
