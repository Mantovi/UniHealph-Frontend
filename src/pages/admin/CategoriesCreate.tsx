import { useState } from 'react';
import { createCategory } from '@/api/category';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { CategoryRequest } from '@/types/category';
import CategoryModal from '@/components/CategoryModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const CategoriesCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: CategoryRequest) => {
    try {
      setLoading(true);
      await createCategory(data);
      toast.success('Categoria criada');
      navigate('/admin/categories');
    } catch {
      toast.error('Erro ao criar categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryModal
      open
      onClose={() => navigate('/admin/categories')}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default CategoriesCreate;