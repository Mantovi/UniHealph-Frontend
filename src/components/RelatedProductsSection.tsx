import { useEffect, useState, useRef, useCallback } from 'react';
import { getRelatedProducts, getProductById } from '@/api/products';
import type { ProductResponse } from '@/types/product';
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

interface Props {
  currentProductId: number;
  productTypeId: number;
}

const RelatedProductsSection = ({ currentProductId, productTypeId }: Props) => {
  const [related, setRelated] = useState<ProductResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [productTypeName, setProductTypeName] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProductTypeName = async () => {
      try {
        const product = await getProductById(currentProductId);
        setProductTypeName(product.productTypeName);
      } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao carregar informações do produto atual.';
        toast.error(message);
      }
    };
    loadProductTypeName();
  }, [currentProductId]);

  const loadMore = useCallback(async () => {
    if (!productTypeName) return;
    try {
      const result = await getRelatedProducts(productTypeId);
      const filtered = result.filter(
        (p) =>
          p.id !== currentProductId &&
          p.productTypeName === productTypeName &&
          p.active
      );
      setRelated((prev) => {
        const map = new Map<number, ProductResponse>();
        const all = [...prev, ...filtered];
        for (const item of all) {
          map.set(item.id, item);
        }
        const unique = Array.from(map.values());
        if (unique.length === prev.length) {
          setHasMore(false);
        }
        return unique;
      });
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao carregar produtos semelhantes.';
        toast.error(message);
    }
  }, [productTypeId, currentProductId, productTypeName]);

  useEffect(() => {
    if (productTypeName) loadMore();
  }, [loadMore, productTypeName]);

  const handleViewRelated = (productId: number) => {
    navigate(`/product/${productId}`);
    window.location.href = `/product/${productId}`;
  };

  return (
    <section className="mt-10 bg-blue-50 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-900">Produtos semelhantes</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        ref={containerRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore) {
            loadMore();
          }
        }}
      >
        {related.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => {}}
            onViewDetails={() => handleViewRelated(product.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProductsSection;