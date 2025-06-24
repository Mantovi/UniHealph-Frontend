import { useState } from 'react';
import { createPlan } from '@/api/plans';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { PlanRequest } from '@/types/plan';
import PlanModal from '@/components/PlanModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const PlansCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: PlanRequest) => {
    try {
      setLoading(true);
      await createPlan(data);
      toast.success('Plano criado com sucesso');
      navigate('/admin/plans');
    } catch {
      toast.error('Erro ao criar plano');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlanModal
      open
      onClose={() => navigate('/admin/plans')}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default PlansCreate;