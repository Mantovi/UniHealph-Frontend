import { useState } from 'react';
import { createBrand } from '@/api/brands';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { BrandRequest } from '@/types/brand';
import BrandModal from '@/components/BrandModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';


const BrandsCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: BrandRequest) => {
    try {
      setLoading(true);
      await createBrand(data);
      toast.success('Marca criada com sucesso');
      navigate('/admin/brands');
    } catch {
      toast.error('Erro ao criar marca');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandModal
      open
      onClose={() => navigate('/admin/brands')}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default BrandsCreate;
