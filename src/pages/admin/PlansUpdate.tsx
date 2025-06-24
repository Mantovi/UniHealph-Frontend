import { useEffect, useState } from 'react';
import { getProductById, updateProduct, getAllBrands } from '@/api/products';
import { getProductTypes } from '@/api/productType';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ProductFormValues } from '@/components/ProductModal';
import ProductModal from '@/components/ProductModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import type { Brand } from '@/types/brand';
import type { ProductType } from '@/types/productType';
import type { ProductUpdate } from '@/types/product';

const ProductsUpdate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<ProductFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [product, b, t] = await Promise.all([
          getProductById(productId),
          getAllBrands(),
          getProductTypes(),
        ]);

        setBrands(b);
        setProductTypes(t);

        setInitialData({
          name: product.name,
          description: product.description,
          price: product.price,
          stockThreshold: product.stockThreshold,
          saleType: product.saleType,
          brandId: b.find((br) => br.name === product.brandName)?.id ?? b[0].id,
          productTypeId: t.find((pt) => pt.name === product.productTypeName)?.id ?? t[0].id,
          initialStock: product.availableStock,
          imageUrls: product.imageUrls,
        });

        setReady(true);
      } catch {
        toast.error('Erro ao carregar produto');
        navigate('/admin/products');
      }
    };
    load();
  }, [productId, navigate]);

  const handleUpdate = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      const updatePayload: ProductUpdate = {
        name: data.name,
        description: data.description,
        price: data.price,
        stockThreshold: data.stockThreshold,
        saleType: data.saleType,
        brandId: data.brandId,
        productTypeId: data.productTypeId,
        productTypeName: productTypes.find((pt) => pt.id === data.productTypeId)?.name ?? '',
        active: true,
        imageUrls: data.imageUrls,
      };

      await updateProduct(productId, updatePayload);
      toast.success('Produto atualizado');
      navigate('/admin/products');
    } catch {
      toast.error('Erro ao atualizar produto');
    } finally {
      setLoading(false);
    }
  };

  if (!ready || !initialData) return null;

  return (
    <ProductModal
      open
      onClose={() => navigate('/admin/products')}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
      brands={brands}
      productTypes={productTypes}
    />
  );
};

export default ProductsUpdate;