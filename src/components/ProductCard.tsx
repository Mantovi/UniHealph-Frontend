import type { FunctionComponent } from 'react';
import type { ProductResponse } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: ProductResponse;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onViewDetails?: () => void;
}

const ProductCard: FunctionComponent<Props> = ({ product, onAddToCart, onBuyNow, onViewDetails }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate(`/product/${product.id}`);
    }
  }

      const mainImage = product.imageUrls.length > 0
        ? product.imageUrls[0]
        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019';
  return (
    <div className="border rounded-xl p-4 shadow bg-white flex flex-col justify-between cursor-pointer hover:shadow-md transition"
    onClick={handleClick}>
        <div>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-40 object-cover rounded-mb mb-3"
          />
        </div>
      <div>
        <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-1">
          Tipo: <strong>{product.saleType === 'VENDA' ? 'Venda' : 'Aluguel'}</strong>
        </p>

        <div className="flex items-center gap-1 text-yellow-500 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={18}
              fill={i <= Math.round(Number(product.averageRating)) ? '#FACC15' : 'none'}
              stroke="#FACC15"
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">({Number(product.averageRating).toFixed(1)})</span>
        </div>

        <p className="text-xl font-bold text-green-600 mb-4">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <Button variant="secondary" onClick={onAddToCart}>
          Adicionar ao carrinho
        </Button>
        <Button onClick={onBuyNow}>Comprar agora</Button>
      </div>
    </div>
  );
};

export default ProductCard;
