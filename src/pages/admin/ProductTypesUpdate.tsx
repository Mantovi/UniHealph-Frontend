import { useEffect, useState } from 'react';
import { getProductTypes, updateProductType } from '@/api/productType';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ProductTypeRequest } from '@/types/productType';
import ProductTypeModal from '@/components/ProductTypeModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const ProductTypesUpdate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const { id } = useParams();
  const typeId = Number(id);
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<ProductTypeRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getProductTypes();
        const found = all.find((t) => t.id === typeId);
        if (!found) {
          toast.error('Tipo de produto não encontrado');
          return navigate(-1);
        }
        setInitialData({
          name: found.name,
          active: found.active,
        });
      } catch {
        toast.error('Erro ao carregar tipo');
      }
    };
    load();
  }, [typeId, navigate]);

  const handleUpdate = async (data: ProductTypeRequest) => {
    try {
      setLoading(true);
      const response = await updateProductType(typeId, data);
      showApiMessage(response);
      if (response.success) { 
        navigate(-1);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao atualizar tipo de produto';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductTypeModal
      open
      onClose={() => navigate(-1)}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};

export default ProductTypesUpdate;