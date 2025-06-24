import { useEffect, useState } from 'react';
import { getProductTypes, updateProductType } from '@/api/productType';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ProductTypeRequest } from '@/types/productType';
import ProductTypeModal from '@/components/ProductTypeModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

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
          return navigate('/admin/product-types');
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
      await updateProductType(typeId, data);
      toast.success('Tipo atualizado com sucesso');
      navigate('/admin/product-types');
    } catch {
      toast.error('Erro ao atualizar tipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductTypeModal
      open
      onClose={() => navigate('/admin/product-types')}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};

export default ProductTypesUpdate;