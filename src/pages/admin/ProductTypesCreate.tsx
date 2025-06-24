import { useState } from 'react';
import { createProductType } from '@/api/productType';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ProductTypeRequest } from '@/types/productType';
import ProductTypeModal from '@/components/ProductTypeModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const ProductTypesCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: ProductTypeRequest) => {
    try {
      setLoading(true);
      await createProductType(data);
      toast.success('Tipo de produto criado');
      navigate('/admin/product-types');
    } catch {
      toast.error('Erro ao criar tipo');
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