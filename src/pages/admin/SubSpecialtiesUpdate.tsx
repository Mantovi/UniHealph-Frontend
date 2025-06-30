import { useEffect, useState } from 'react';
import { getSubSpecialties, updateSubSpecialty } from '@/api/subspecialty';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { SubSpecialtyRequest } from '@/types/subspecialty';
import SubSpecialtyModal from '@/components/SubSpecialtyModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

export default function SubSpecialtiesUpdate () {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const { id } = useParams();
  const subId = Number(id);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<SubSpecialtyRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getSubSpecialties();
        const found = all.find((s) => s.id === subId);
        if (!found) {
          toast.error('Subespecialidade não encontrada');
          return navigate(-1);
        }
        setInitialData({ name: found.name, active: found.active, categories: found.categories ?? [] });
      } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao carregar informações do produto atual.';
        toast.error(message);
      }
    };
    load();
  }, [subId, navigate]);

  const handleUpdate = async (data: SubSpecialtyRequest) => {
    try {
      setLoading(true);
      const response = await updateSubSpecialty(subId, data);
      showApiMessage(response);
      if (response.success) {
        navigate(-1);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao atualizar sub-especialidade';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubSpecialtyModal
      open
      onClose={() => navigate(-1)}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};