import { useEffect, useState } from 'react';
import { getBrands, updateBrand } from '@/api/brands';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { BrandRequest } from '@/types/brand';
import BrandModal from '@/components/BrandModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

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
          return navigate(-1);
        }
        setInitialData({ name: found.name });
      } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao carregar marcas';
        toast.error(message);
      }
    };
    load();
  }, [brandId, navigate]);

  const handleUpdate = async (data: BrandRequest) => {
    try {
      setLoading(true);
      await updateBrand(brandId, data);
      toast.success('Marca atualizada com sucesso');
      navigate(-1);
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao atualizar marca';
        toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandModal
      open
      onClose={() => navigate(-1)}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};

export default BrandsUpdate;
