import { useEffect, useState } from 'react';
import { getSpecialties, updateSpecialty } from '@/api/specialty';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { SpecialtyRequest } from '@/types/specialty';
import SpecialtyModal from '@/components/SpecialtyModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const SpecialtiesUpdate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const { id } = useParams();
  const specialtyId = Number(id);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<SpecialtyRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getSpecialties();
        const found = all.find((s) => s.id === specialtyId);
        if (!found) {
          toast.error('Especialidade não encontrada');
          return navigate('/admin/specialties');
        }
        setInitialData({
          name: found.name,
          active: found.active,
          subSpecialties: found.subSpecialties,
        });
      } catch {
        toast.error('Erro ao carregar especialidade');
      }
    };
    load();
  }, [specialtyId, navigate]);

  const handleUpdate = async (data: SpecialtyRequest) => {
    try {
      setLoading(true);
      const response =await updateSpecialty(specialtyId, data);
      showApiMessage(response);
      if (response.success) {
        navigate('/admin/specialties');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao atualizar especialidade';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpecialtyModal
      open
      onClose={() => navigate('/admin/specialties')}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};

export default SpecialtiesUpdate;