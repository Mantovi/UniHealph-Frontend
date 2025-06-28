import { useEffect, useState } from 'react';
import { createProduct } from '@/api/products';
import { getAllBrands } from '@/api/products';
import { getProductTypes } from '@/api/productType';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { ProductFormValues } from '@/components/ProductModal';
import ProductModal from '@/components/ProductModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import type { Brand } from '@/types/brand';
import type { ProductType } from '@/types/productType';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import { showApiMessage } from '@/utils/showApiMessage';

const ProductsCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [b, t] = await Promise.all([getAllBrands(), getProductTypes()]);
        setBrands(b);
        setProductTypes(t);
        setReady(true);
      } catch {
        toast.error('Erro ao carregar dados');
        navigate('/admin/products');
      }
    };
    load();
  }, [navigate]);

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const response = await createProduct(data);
      showApiMessage(response);
      if (response.success) navigate('/admin/products');
    } catch (error: unknown) {
          const axiosError = error as AxiosError<ApiResponse<null>>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Erro inesperado';
    toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <ProductModal
      open
      onClose={() => navigate('/admin/products')}
      onSubmit={handleSubmit}
      loading={loading}
      brands={brands}
      productTypes={productTypes}
    />
  );
};

export default ProductsCreate;