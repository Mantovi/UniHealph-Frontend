import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { submitReview, updateReview } from '@/api/reviews';
import type { ReviewResponse } from '@/types/review';
import { toast } from 'react-toastify';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

interface Props {
  open: boolean;
  productId: number;
  onClose: () => void;
  onReviewSubmitted: () => void;
  review?: ReviewResponse | null;
  mode?: 'create' | 'edit';
}

export default function ReviewModal({
  open,
  productId,
  onClose,
  onReviewSubmitted,
  review,
  mode = 'create',
}: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && review) {
      setRating(review.rating);
      setComment(review.comment);
    } else {
      setRating(5);
      setComment('');
    }
  }, [mode, review]);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error('Comentário obrigatório');
      return;
    }

    try {
      setLoading(true);
      let response;
      if (mode === 'edit' && review) {
         response = await updateReview(review.id, { rating, comment });
      } else {
        response = await submitReview(productId, { rating, comment });
      }
      
      showApiMessage(response, { successMessage: mode === 'edit' ? 'Avaliação atualizada' : 'Avaliação enviada', 
        errorMessage: mode === 'edit' ? 'Erro ao atualizar avaliação' : 'Erro ao enviar avaliação' });

        if (response.success) {
          onReviewSubmitted();
          onClose();
        }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao enviar avaliação';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Avaliação</DialogTitle>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {mode === 'edit' ? 'Editar avaliação' : 'Avaliar produto'}
          </h2>

          <Label>Nota</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={24}
                className="cursor-pointer"
                fill={i <= rating ? '#FACC15' : 'none'}
                stroke="#FACC15"
                onClick={() => setRating(i)}
              />
            ))}
          </div>

          <Label>Comentário</Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escreva sua experiência..."
          />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enviando...' : mode === 'edit' ? 'Salvar alterações' : 'Enviar avaliação'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
