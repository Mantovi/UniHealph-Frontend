import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/api/products';
import { addToCart } from '@/api/cart';
import type { ProductResponse } from '@/types/product';
import { toast } from 'react-toastify';
import { Star } from 'lucide-react';
import CheckoutModal from '@/components/CheckoutModal';
import { Button } from '@/components/ui/button';
import ReviewSection from '@/components/ReviewSection';
import RelatedProductsSection from '@/components/RelatedProductsSection';

export default function Product() {
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

    return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Grid superior: imagens, info e descrição */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Galeria de imagens */}
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

        {/* Info principais */}
        <div className="md:col-span-5 space-y-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>

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
                />
            </div>
            )}

            <div className="flex gap-4 mt-4">
            <Button onClick={() => setModalOpen(true)}>Comprar</Button>
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
            >
                Adicionar ao carrinho
            </Button>
            </div>
        </div>

        {/* Descrição lateral */}
        <div className="md:col-span-3">
            <h2 className="text-lg font-semibold mb-2">Descrição</h2>
            <div className="h-64 overflow-y-auto border rounded p-3 text-sm leading-relaxed bg-white">
            {product.description}
            </div>
        </div>
        </div>

        {/* Espaçamento entre blocos */}
        <div className="my-12 border-b"></div>

        {/* Avaliações */}
        <ReviewSection productId={product.id} />

        {/* Espaçamento entre seções */}
        <div className="my-12 border-b"></div>

        {/* Produtos semelhantes */}
        <RelatedProductsSection
        currentProductId={product.id}
        productTypeId={product.productTypeId}
        />

        {/* Checkout modal */}
        <CheckoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => toast.success('Compra confirmada!')}
        productName={product.name}
        />
    </div>
    );
}
