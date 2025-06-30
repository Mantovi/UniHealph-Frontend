import { useState } from 'react';
import { createBrand } from '@/api/brands';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { BrandRequest } from '@/types/brand';
import BrandModal from '@/components/BrandModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const BrandsCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: BrandRequest) => {
    try {
      setLoading(true);
      const response = await createBrand(data);
      showApiMessage(response);
      navigate(-1);
    } catch (error: unknown) {
            const axiosError = error as AxiosError<ApiResponse<null>>;
            const message = axiosError.response?.data?.message ||
            axiosError.message ||
            'Erro ao criar marca';
            toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandModal
      open
      onClose={() => navigate(-1)}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default BrandsCreate;