import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/api/products';
import { addToCart } from '@/api/cart';
import { directPurchase } from '@/api/orders';
import { getPaymentMethods } from '@/api/payment';
import type { ProductResponse } from '@/types/product';
import type { PaymentMethod } from '@/types/payment';
import { toast } from 'react-toastify';
import { Star } from 'lucide-react';
import CheckoutModal from '@/components/CheckoutModal';
import { Button } from '@/components/ui/button';
import ReviewSection from '@/components/ReviewSection';
import RelatedProductsSection from '@/components/RelatedProductsSection';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import ProductDirectBuyModal from '@/components/ProductDirectBuyModal';
import { showApiMessage } from '@/utils/showApiMessage';

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [semesterCount, setSemesterCount] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [directBuyModalOpen, setDirectBuyModalOpen] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);


  useEffect(() => {
    if (modalOpen) {
      getPaymentMethods()
        .then(setPaymentMethods)
        .catch(() => toast.error('Erro ao carregar métodos de pagamento'));
    }
  }, [modalOpen]);

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
      await directPurchase({
        productId: product.id,
        quantity,
        semesterCount: product.saleType === 'ALUGUEL' ? semesterCount : undefined,
        pointsToUse: pointsToUse
      });
      setModalOpen(false);
      toast.success('Compra realizada com sucesso!');

      const updatedProduct = await getProductById(Number(id));
      setProduct(updatedProduct);
      setPointsToUse(0);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || 'Erro ao comprar';
      toast.error(message);
      setModalOpen(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const response = await addToCart({
        productId: product.id,
        quantity,
        semesterCount: product.saleType === 'ALUGUEL' ? semesterCount : undefined,
      });
      showApiMessage(response);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || 'Erro ao adicionar ao carrinho';
      toast.error(message);
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
      {isDisabled && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 font-semibold text-center rounded">
          Este produto está desativado e não pode ser comprado, avaliado ou adicionado ao carrinho.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <section className="md:col-span-4 flex flex-col gap-4">
          {selectedImage && (
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full max-h-80 object-contain rounded-xl border bg-white"
            />
          )}
          <div className="flex gap-2 overflow-x-auto scrollbar-thin py-1">
            {product.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumb ${index}`}
                onClick={() => setSelectedImage(url)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2
                  ${selectedImage === url ? 'border-blue-700' : 'border-gray-200'}`}
              />
            ))}
          </div>
        </section>

        <section className="md:col-span-5 flex flex-col gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-blue-900 break-words">{product.name}</h1>

          <div className="flex items-center gap-1 text-yellow-500">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={20} fill={i <= Math.round(product.averageRating) ? '#FACC15' : 'none'} stroke="#FACC15" />
            ))}
            <span className="text-sm text-gray-600 ml-1">({Number(product.averageRating).toFixed(1)})</span>
          </div>

          <p className="text-2xl font-bold text-green-600">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>

          <p className="text-sm">Tipo de venda: <strong>{product.saleType === 'VENDA' ? 'Venda' : 'Aluguel'}</strong></p>
          <p className="text-sm">Estoque disponível: <strong>{product.availableStock}</strong></p>

          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold">Quantidade:</label>
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
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold">Semestres:</label>
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

          <div className="flex flex-col md:flex-row gap-2 mt-4">
            <Button
              onClick={() => setDirectBuyModalOpen(true)}
              disabled={isDisabled}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-black"
            >
              Comprar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddToCart}
              disabled={isDisabled}
              className="w-full md:w-auto bg-blue-300 hover:bg-blue-500"
            >
              Adicionar ao carrinho
            </Button>
          </div>
        </section>

        <section className="md:col-span-3">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Descrição</h2>
          <div className="h-52 md:h-64 overflow-y-auto border rounded p-3 text-sm leading-relaxed bg-white">
            {product.description}
          </div>
        </section>
      </div>

      <div className="my-10">
        <ReviewSection productId={product.id} isActive={product.active} />
      </div>

      {product.active && (
        <div className="my-10">
          <RelatedProductsSection
            currentProductId={product.id}
            productTypeId={product.productTypeId}
          />
        </div>
      )}

      <ProductDirectBuyModal
        open={directBuyModalOpen}
        onClose={() => setDirectBuyModalOpen(false)}
        originalPrice={product.price * quantity}
        onConfirm={(points) => {
          setPointsToUse(points);
          setDirectBuyModalOpen(false);
          setModalOpen(true);
        }}
      />
      <CheckoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleBuyNow}
        productName={product.name}
        paymentMethods={paymentMethods}
      />
    </div>

  );
}

export default Product;