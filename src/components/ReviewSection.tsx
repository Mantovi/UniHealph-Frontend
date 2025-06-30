import { useEffect, useRef, useState, useCallback } from 'react';
import { getProductReviews } from '@/api/reviews';
import type { ReviewResponse } from '@/types/review';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import ReviewModal from './ReviewModal';
import { useAuthStore } from '@/store/authStore';

interface Props {
  productId: number;
  isActive: boolean;
}

const ReviewSection = ({ productId, isActive }: Props) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editReview, setEditReview] = useState<ReviewResponse | null>(null);

  const { user } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const loadReviews = useCallback(async (pageToLoad: number) => {
    try {
      const newReviews = await getProductReviews(productId, pageToLoad);
      if (newReviews.length === 0) {
        setHasMore(false);
        return;
      }
      if (pageToLoad === 0) setReviews(newReviews);
      else setReviews((prev) => [...prev, ...newReviews]);
    } catch {
      setHasMore(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews(0);
  }, [loadReviews]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20 && hasMore) {
        const next = page + 1;
        loadReviews(next);
        setPage(next);
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [page, hasMore, loadReviews]);

  const totalReviews = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const average = totalReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const censorName = (name: string) =>
    name.length < 3
      ? '*'.repeat(name.length)
      : name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];

  const myReview = reviews.find((r) => r.userId === user?.id);
  const otherReviews = reviews.filter((r) => r.userId !== user?.id);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h2 className="text-lg font-semibold mb-2 text-blue-900">Avaliações ({totalReviews})</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl font-bold">{average.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={20}
                fill={i <= Math.round(average) ? '#FACC15' : 'none'}
                stroke="#FACC15"
              />
            ))}
          </div>
        </div>
        {ratingDistribution.map((item) => (
          <div key={item.star} className="flex items-center gap-2 text-sm">
            <span>{item.star}★</span>
            <div className="flex-1 bg-gray-200 rounded h-2">
              <div
                className="bg-yellow-400 h-2 rounded"
                style={{ width: `${(item.count / totalReviews) * 100 || 0}%` }}
              ></div>
            </div>
            <span>{item.count}</span>
          </div>
        ))}
        {isActive && (
          <Button className="mt-4 w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-black" onClick={() => {
            setEditReview(null);
            setModalOpen(true);
          }}>
            Escrever avaliação
          </Button>
        )}
      </div>

      <div
        className="md:col-span-2 border rounded-2xl p-4 max-h-[400px] overflow-y-auto bg-white scrollbar-thin"
        ref={containerRef}
      >
        {myReview && (
          <div key={myReview.id} className="border-b py-3 bg-yellow-50 rounded">
            <div className="flex items-center gap-2 text-yellow-500 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i <= myReview.rating ? '#FACC15' : 'none'}
                  stroke="#FACC15"
                />
              ))}
            </div>
            <p className="text-sm font-semibold text-gray-700">Você</p>
            <p className="text-sm text-gray-600">{myReview.comment}</p>
            <p className="text-xs text-gray-400">
              {new Date(myReview.createdAt).toLocaleDateString('pt-BR')}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 text-xs"
              onClick={() => {
                setEditReview(myReview);
                setModalOpen(true);
              }}
            >
              Editar
            </Button>
          </div>
        )}

        {otherReviews.length === 0 ? (
          <p className="text-sm text-gray-500 mt-4">Nenhuma outra avaliação ainda.</p>
        ) : (
          otherReviews.map((r) => (
            <div key={r.id} className="border-b py-3">
              <div className="flex items-center gap-2 text-yellow-500 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i <= r.rating ? '#FACC15' : 'none'}
                    stroke="#FACC15"
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-700">{r.userId === user?.id ? 'Você' : censorName(r.userName)}</p>
              <p className="text-sm text-gray-600">{r.comment}</p>
              <p className="text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))
        )}
      </div>
      <ReviewModal
        open={modalOpen}
        productId={productId}
        review={editReview}
        mode={editReview ? 'edit' : 'create'}
        onClose={() => {
          setModalOpen(false);
          setEditReview(null);
        }}
        onReviewSubmitted={() => {
          setPage(0);
          loadReviews(0);
        }}
      />
    </section>
  );
};

export default ReviewSection;