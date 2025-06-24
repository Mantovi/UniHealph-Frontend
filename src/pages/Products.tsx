import { useEffect, useState, useCallback, useRef } from 'react';
import { searchProducts } from '@/api/products';
import { addToCart } from '@/api/cart';
import { checkoutItem } from '@/api/orders';
import type { ProductResponse } from '@/types/product';
import { toast } from 'react-toastify';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import ProductSortMenu from '@/components/ProductSortMenu';
import CategoryTreeFilter from '@/components/CategoryTreeFilter';
import ProductBrandFilter from '@/components/ProductBrandFilter';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CheckoutModal from '@/components/CheckoutModal';

const Products = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [saleTypes, setSaleTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProductTypes, setSelectedProductTypes] = useState<number[]>([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
  const [searchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [productToBuy, setProductToBuy] = useState<ProductResponse | null>(null);

  const navigate = useNavigate();

  const [isFilterLocked, setIsFilterLocked] = useState(false);
  const lockFiltersTemporarily = () => {
    setIsFilterLocked(true);
    setTimeout(() => setIsFilterLocked(false), 500);
  };

  const lastRequestId = useRef(0);

  useEffect(() => {
    const productTypeIds = searchParams.getAll('productTypeIds')
      .map(Number)
      .filter((n) => !isNaN(n));
    setSelectedProductTypes(productTypeIds);

    const brandIds = searchParams.getAll('brandIds')
      .map(Number)
      .filter((n) => !isNaN(n));
    setSelectedBrandIds(brandIds);

    const saleTypesFromUrl = searchParams.getAll('saleType')
      .filter((v) => v === 'VENDA' || v === 'ALUGUEL');
    setSaleTypes(saleTypesFromUrl);

    setInitialized(true);
  }, [searchParams]);

  const loadProducts = useCallback(async () => {
    const requestId = ++lastRequestId.current;
    try {
      const query = searchParams.get('q')?.trim();

      const data = await searchProducts({
        q: query || undefined,
        saleType: saleTypes.length === 1 ? (saleTypes[0] as 'VENDA' | 'ALUGUEL') : undefined,
        sortBy,
        direction,
        productTypeIds: selectedProductTypes.length > 0 ? selectedProductTypes : undefined,
        brandIds: selectedBrandIds.length > 0 ? selectedBrandIds : undefined,
      });

      if (requestId === lastRequestId.current) {
        setProducts(data);
      }

    } catch {
      if (requestId === lastRequestId.current) {
        toast.error('Erro ao buscar produtos');
      }
    }
  }, [searchParams, saleTypes, sortBy, direction, selectedProductTypes, selectedBrandIds]);

  useEffect(() => {
    if (initialized) loadProducts();
  }, [loadProducts, initialized]);

  const handleToggleSaleType = (type: string) => {
    if (isFilterLocked) return;
    lockFiltersTemporarily();

    setSaleTypes((prev) => {
      const updated = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];

      const params = new URLSearchParams(searchParams);
      params.delete('saleType');
      updated.forEach((t) => params.append('saleType', t));

      navigate(`/products?${params.toString()}`, { replace: true });

      return updated;
    });
  };

  const handleToggleProductType = (id: number) => {
    if (isFilterLocked) return;
    lockFiltersTemporarily();

    setSelectedProductTypes((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];

      const params = new URLSearchParams(searchParams);
      params.delete('productTypeIds');
      updated.forEach((pid) => params.append('productTypeIds', pid.toString()));

      navigate(`/products?${params.toString()}`, { replace: true });

      return updated;
    });
  };

  const handleToggleBrand = (id: number) => {
    if (isFilterLocked) return;
    lockFiltersTemporarily();

    setSelectedBrandIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];

      const params = new URLSearchParams(searchParams);
      params.delete('brandIds');
      updated.forEach((bid) => params.append('brandIds', bid.toString()));

      navigate(`/products?${params.toString()}`, { replace: true });

      return updated;
    });
  };

  const handleAddToCart = async (product: ProductResponse) => {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
        semesterCount: product.saleType === 'ALUGUEL' ? 1 : undefined,
      });
      toast.success('Adicionado ao carrinho');
    } catch {
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  const handleBuyNow = async (product: ProductResponse) => {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
        semesterCount: product.saleType === 'ALUGUEL' ? 1 : undefined,
      });
      setProductToBuy(product);
      setModalOpen(true);
    } catch {
      toast.error('Erro ao comprar produto');
    }
  };

  const handleConfirmPurchase = async (paymentMethod: string) => {
    if (!productToBuy) return;

    try {
      await checkoutItem(productToBuy.id);
      toast.success(`Compra realizada com sucesso via ${paymentMethod}`);
      setModalOpen(false);
      setProductToBuy(null);
    } catch {
      toast.error('Erro ao comprar produto');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-4 py-8">
        <div className="w-full md:w-64 space-y-8">
          <ProductFilters
            selectedSaleTypes={saleTypes}
            onToggleSaleType={handleToggleSaleType}
          />
          <CategoryTreeFilter
            selectedProductTypes={selectedProductTypes}
            onToggleProductType={handleToggleProductType}
          />
          <ProductBrandFilter
            selectedBrandIds={selectedBrandIds}
            onToggleBrand={handleToggleBrand}
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Produtos</h1>
            <ProductSortMenu
              sortBy={sortBy}
              direction={direction}
              onChange={(field, dir) => {
                setSortBy(field);
                setDirection(dir);
              }}
            />
          </div>

          {products.length === 0 ? (
            <p className="text-gray-500">Nenhum produto encontrado com os filtros atuais.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onBuyNow={() => handleBuyNow(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CheckoutModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setProductToBuy(null);
        }}
        onConfirm={handleConfirmPurchase}
        productName={productToBuy?.name}
      />
    </>
  );
};

export default Products;