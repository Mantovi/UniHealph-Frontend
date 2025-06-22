export interface ReviewCreate {
  productId: number;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  userName: string;
  createdAt: string;
}
