import { useEffect, useState } from 'react';
import { getBrands, updateBrand } from '@/api/brands';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { BrandRequest } from '@/types/brand';
import BrandModal from '@/components/BrandModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';


const BrandsUpdate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);
  
  const { id } = useParams();
  const brandId = Number(id);
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<BrandRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getBrands();
        const found = all.find((b) => b.id === brandId);
        if (!found) {
          toast.error('Marca não encontrada');
          return navigate('/admin/brands');
        }
        setInitialData({ name: found.name });
      } catch {
        toast.error('Erro ao carregar marca');
      }
    };
    load();
  }, [brandId, navigate]);

  const handleUpdate = async (data: BrandRequest) => {
    try {
      setLoading(true);
      await updateBrand(brandId, data);
      toast.success('Marca atualizada com sucesso');
      navigate('/admin/brands');
    } catch {
      toast.error('Erro ao atualizar marca');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandModal
      open
      onClose={() => navigate('/admin/brands')}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};

export default BrandsUpdate;