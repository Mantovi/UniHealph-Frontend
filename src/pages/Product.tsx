import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/api/products';
import { addToCart, getCartItems, removeCartItem } from '@/api/cart';
import { checkoutItem } from '@/api/orders';
import type { ProductResponse } from '@/types/product';
import { toast } from 'react-toastify';
import { Star } from 'lucide-react';
import CheckoutModal from '@/components/CheckoutModal';
import { Button } from '@/components/ui/button';
import ReviewSection from '@/components/ReviewSection';
import RelatedProductsSection from '@/components/RelatedProductsSection';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [semesterCount, setSemesterCount] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    getProductById(Number(id))
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.imageUrls?.[0] || null);
      })
      .catch(() => toast.error('Erro ao carregar produto'));
  }, [id]);

  if (!product) return <p className="text-center mt-10">Carregando produto...</p>;

  const isDisabled = !product.active;

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      const cartItems = await getCartItems();

      const cartItemExistente = cartItems.find(
        (item) => item.productId === product.id
      );

      if (cartItemExistente) {
        const mesmaQuantidade = cartItemExistente.quantity === quantity;
        const mesmoSemestre =
          product.saleType !== 'ALUGUEL' ||
          cartItemExistente.semesterCount === semesterCount;

        if (!mesmaQuantidade || !mesmoSemestre) {
          await removeCartItem(product.id);
        }
      }

      await addToCart({
        productId: product.id,
        quantity,
        semesterCount: product.saleType === 'ALUGUEL' ? semesterCount : undefined,
      });

      const cartItemsAtualizado = await getCartItems();
      const cartItem = cartItemsAtualizado.find(
        (item) =>
          item.productId === product.id &&
          item.quantity === quantity &&
          (product.saleType !== 'ALUGUEL' || item.semesterCount === semesterCount)
      );
      if (!cartItem) throw new Error('Não foi possível encontrar o item no carrinho');

      await checkoutItem(cartItem.productId);

      setModalOpen(false);
      toast.success('Compra realizada com sucesso!');

      const updatedProduct = await getProductById(Number(id));
      setProduct(updatedProduct);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || 'Erro ao comprar';
      toast.error(message);
      setModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {isDisabled && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 font-semibold text-center rounded">
          Este produto está desativado e não pode ser comprado, avaliado ou adicionado ao carrinho.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-4">
          {selectedImage && (
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-80 object-cover rounded-xl border"
            />
          )}
          <div className="flex gap-2 overflow-x-auto">
            {product.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumb ${index}`}
                onClick={() => setSelectedImage(url)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  selectedImage === url ? 'border-primary' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-5 space-y-4">
          <h1 className="text-2xl font-bold break-all line-clamp-2">{product.name}</h1>

          <div className="flex items-center gap-1 text-yellow-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={20}
                fill={i <= Math.round(product.averageRating) ? '#FACC15' : 'none'}
                stroke="#FACC15"
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({Number(product.averageRating).toFixed(1)})
            </span>
          </div>

          <p className="text-3xl font-bold text-green-600">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>

          <p className="text-sm">Tipo de venda: <strong>{product.saleType}</strong></p>
          <p className="text-sm">Estoque disponível: <strong>{product.availableStock}</strong></p>

          <div className="flex gap-4 items-center">
            <label>Quantidade:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              min={1}
              className="border rounded px-2 py-1 w-20"
              disabled={isDisabled}
            />
          </div>

          {product.saleType === 'ALUGUEL' && (
            <div className="flex gap-4 items-center">
              <label>Semestres:</label>
              <input
                type="number"
                value={semesterCount}
                onChange={(e) => setSemesterCount(Math.max(1, Number(e.target.value)))}
                min={1}
                className="border rounded px-2 py-1 w-20"
                disabled={isDisabled}
              />
            </div>
          )}

          <div className="flex gap-4 mt-4">
            <Button onClick={() => setModalOpen(true)} disabled={isDisabled}>
              Comprar
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  await addToCart({
                    productId: product.id,
                    quantity,
                    semesterCount: product.saleType === 'ALUGUEL' ? semesterCount : undefined,
                  });
                  toast.success('Adicionado ao carrinho');
                } catch {
                  toast.error('Erro ao adicionar ao carrinho');
                }
              }}
              disabled={isDisabled}
            >
              Adicionar ao carrinho
            </Button>
          </div>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-lg font-semibold mb-2">Descrição</h2>
          <div className="h-64 overflow-y-auto border rounded p-3 text-sm leading-relaxed bg-white">
            {product.description}
          </div>
        </div>
      </div>

      <div className="my-12 border-b"></div>

      <ReviewSection productId={product.id} isActive={product.active} />

      {product.active && (
        <>
          <div className="my-12 border-b"></div>
          <RelatedProductsSection
            currentProductId={product.id}
            productTypeId={product.productTypeId}
          />
        </>
      )}

      <CheckoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleBuyNow}
        productName={product.name}
      />
    </div>
  );
}

export default Product;