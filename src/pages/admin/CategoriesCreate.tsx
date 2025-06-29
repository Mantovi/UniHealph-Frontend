import { useState } from 'react';
import { createCategory } from '@/api/category';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { CategoryRequest } from '@/types/category';
import CategoryModal from '@/components/CategoryModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const CategoriesCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: CategoryRequest) => {
    try {
      setLoading(true);
      const response =await createCategory(data);
      showApiMessage(response)
      if(response.success) { 
        navigate(-1);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || 
        axiosError.message || 
        'Erro ao criar categoria';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryModal
      open
      onClose={() => navigate(-1)}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default CategoriesCreate;