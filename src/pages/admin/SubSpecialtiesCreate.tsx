import { useState } from 'react';
import { createSubSpecialty } from '@/api/subspecialty';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { SubSpecialtyRequest } from '@/types/subspecialty';
import SubSpecialtyModal from '@/components/SubSpecialtyModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const SubSpecialtiesCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: SubSpecialtyRequest) => {
    try {
      setLoading(true);
      const response = await createSubSpecialty(data);
      showApiMessage(response)
      if (!response.success) {
        navigate('/admin/sub-specialties');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao criar sub-especialidade';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubSpecialtyModal
      open
      onClose={() => navigate('/admin/sub-specialties')}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default SubSpecialtiesCreate;