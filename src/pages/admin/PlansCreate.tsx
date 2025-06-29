import { useState } from 'react';
import { createPlan } from '@/api/plans';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { PlanRequest } from '@/types/plan';
import PlanModal from '@/components/PlanModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { ApiResponse } from '@/types/api';
import type { AxiosError } from 'axios';

const PlansCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: PlanRequest) => {
    try {
      setLoading(true);
      const response = await createPlan(data);
      showApiMessage(response)
      if (response.success) {
        navigate(-1);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao criar plano';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlanModal
      open
      onClose={() => navigate(-1)}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default PlansCreate;