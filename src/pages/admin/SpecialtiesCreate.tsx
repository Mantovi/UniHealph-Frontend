import { useState } from 'react';
import { createSpecialty } from '@/api/specialty';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { SpecialtyRequest } from '@/types/specialty';
import SpecialtyModal from '@/components/SpecialtyModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const SpecialtiesCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: SpecialtyRequest) => {
    try {
      setLoading(true);
      const response = await createSpecialty(data);
      showApiMessage(response)
      if (!response.success) {
        navigate('/admin/specialties');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao criar especialidade';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpecialtyModal
      open
      onClose={() => navigate('/admin/specialties')}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default SpecialtiesCreate;