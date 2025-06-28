import { useState } from 'react';
import { createProductType } from '@/api/productType';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ProductTypeRequest } from '@/types/productType';
import ProductTypeModal from '@/components/ProductTypeModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const ProductTypesCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: ProductTypeRequest) => {
    try {
      setLoading(true);
      const response = await createProductType(data);
      showApiMessage(response)
      if (response.success) {
        navigate('/admin/product-types');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao criar tipo de produto';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductTypeModal
      open
      onClose={() => navigate('/admin/product-types')}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default ProductTypesCreate;