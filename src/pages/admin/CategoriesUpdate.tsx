import { useEffect, useState } from 'react';
import { getCategories, updateCategory } from '@/api/category';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { CategoryRequest } from '@/types/category';
import CategoryModal from '@/components/CategoryModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const CategoriesUpdate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const { id } = useParams();
  const categoryId = Number(id);
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<CategoryRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getCategories();
        const found = all.find((c) => c.id === categoryId);
        if (!found) {
          toast.error('Categoria não encontrada');
          return navigate('/admin/categories');
        }
        setInitialData({
          name: found.name,
          active: found.active,
          productTypes: found.productTypes ?? [],
        });
      } catch {
        toast.error('Erro ao carregar categoria');
      }
    };
    load();
  }, [categoryId, navigate]);

  const handleUpdate = async (data: CategoryRequest) => {
    try {
      setLoading(true);
      const response = await updateCategory(categoryId, data);
      showApiMessage(response);
      if (response.success) {
        navigate('/admin/categories');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || 
        axiosError.message || 
        'Erro ao atualizar categoria';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryModal
      open
      onClose={() => navigate('/admin/categories')}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};

export default CategoriesUpdate;