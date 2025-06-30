import { useEffect, useState, useCallback, useRef } from 'react';
import { searchProducts } from '@/api/products';
import { addToCart } from '@/api/cart';
import type { ProductResponse } from '@/types/product';
import { toast } from 'react-toastify';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import ProductSortMenu from '@/components/ProductSortMenu';
import CategoryTreeFilter from '@/components/CategoryTreeFilter';
import ProductBrandFilter from '@/components/ProductBrandFilter';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const Products = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [saleTypes, setSaleTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProductTypes, setSelectedProductTypes] = useState<number[]>([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
  const [searchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);

  const [openSheet, setOpenSheet] = useState(false);

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
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
      axiosError.message ||
      'Erro ao carregar produtos';
      if (requestId === lastRequestId.current) {
        toast.error(message);
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
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao adicionar ao carrinho';
        toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      <div className="max-w-7xl mx-auto px-2 md:px-4 flex flex-col md:flex-row gap-8">
        
        <div className="md:hidden mb-4 w-full flex justify-between">
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger asChild>
              <button className="w-full bg-blue-300  rounded-xl font-semibold p-3 shadow hover:bg-blue-800 hover:text-white transition">
                Filtros e Ordenações
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto">
              <div className="flex justify-end mb-4">
                <ProductSortMenu
                  sortBy={sortBy}
                  direction={direction}
                  onChange={(field, dir) => {
                    setSortBy(field);
                    setDirection(dir);
                  }}
                />
              </div>

              <div className="space-y-8 py-2 ml-2">
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
                <SheetClose asChild>
                  <button className="w-full bg-emerald-600 text-white rounded-xl p-3 font-bold mt-3">
                    Aplicar filtros
                  </button>
                </SheetClose>
              </div>
            </SheetContent>

          </Sheet>
        </div>

        <aside className="w-full md:w-64 flex-shrink-0 space-y-8 bg-white rounded-3xl shadow-md p-4 md:p-6 border border-blue-100 
        md:sticky md:top-20 h-fit md:h-[80vh] md:max-h-[80vh] md:overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 hidden md:block">
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
        </aside>
        
        <main className="flex-1 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            <h1 className="text-2xl font-bold text-blue-900">Produtos</h1>
            <div className="hidden md:block">
              <ProductSortMenu
                sortBy={sortBy}
                direction={direction}
                onChange={(field, dir) => {
                  setSortBy(field);
                  setDirection(dir);
                }}
              />
            </div>
          </div>
          {products.length === 0 ? (
            <p className="text-blue-700 bg-blue-100 rounded-lg p-6 text-center text-lg font-medium">
              Nenhum produto encontrado com os filtros atuais.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;