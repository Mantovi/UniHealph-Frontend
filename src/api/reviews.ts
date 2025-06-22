import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { ReviewResponse } from '@/types/review';

export async function getProductReviews(productId: number, page: number): Promise<ReviewResponse[]> {
  const res = await api.get<ApiResponse<ReviewResponse[]>>(`/api/reviews/product/${productId}`, {
    params: {
      page,
    },
  });

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message ?? 'Erro ao buscar avaliações');
  }

  return res.data.data;
}

export async function submitReview(
  productId: number,
  data: { rating: number; comment: string }
): Promise<void> {
  const res = await api.post<ApiResponse<null>>('/api/reviews', {
    productId,
    rating: data.rating,
    comment: data.comment,
    createdAt: new Date().toISOString(), // Se necessário pelo backend
  });

  if (!res.data.success) {
    throw new Error(res.data.message ?? 'Erro ao enviar avaliação');
  }
}

export async function updateReview(
  reviewId: number,
  data: { rating: number; comment: string }
): Promise<void> {
  const res = await api.patch<ApiResponse<null>>(`/api/reviews/${reviewId}`, data);

  if (!res.data.success) {
    throw new Error(res.data.message ?? 'Erro ao atualizar avaliação');
  }
}
