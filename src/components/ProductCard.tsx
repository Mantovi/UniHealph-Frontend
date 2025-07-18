import type { FunctionComponent } from 'react';
import type { ProductResponse } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: ProductResponse;
  onAddToCart: () => void;
  onViewDetails?: () => void;
}

const ProductCard: FunctionComponent<Props> = ({ product, onAddToCart, onViewDetails }) => {
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

  const isDisabled = !product.active;

  return (
    <div
      className={`border-2 rounded-xl p-4 shadow bg-white flex flex-col justify-between hover:shadow-lg transition relative ${
        isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={!isDisabled ? handleClick : undefined}
    >
      {!product.active && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
          Desativado
        </span>
      )}

      <img
        src={mainImage}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg mb-3 border"
      />

      <h2 className="text-lg font-semibold mb-1 break-words line-clamp-2 text-blue-900">{product.name}</h2>
      <p className="text-xs text-gray-600 mb-1">
        Tipo: <span className="font-medium">{product.saleType === 'VENDA' ? 'Venda' : 'Aluguel'}</span>
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

      <p className="text-xl font-bold text-green-600 mb-3">
        R$ {product.price.toFixed(2).replace('.', ',')}
      </p>

      <div className="flex flex-col gap-2 mt-auto">
        <Button
          variant="secondary"
          size="sm"
          className="w-full font-medium bg-blue-300 hover:bg-blue-500"
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          disabled={isDisabled}
        >
          Adicionar ao carrinho
        </Button>
        <Button
          variant="default"
          className="w-full font-medium bg-emerald-900 hover:bg-black"

          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          disabled={isDisabled}
        >
          Ver Produto
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;