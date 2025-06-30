import { useEffect, useState } from 'react';
import { getPlans, deletePlan } from '@/api/plans';
import type { Plan } from '@/types/plan';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { sortByAlpha } from '@/utils/sort';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const Plans = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await getPlans();
      setPlans(sortByAlpha(data, 'name'));
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao carregar planos';
        toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este plano?')) return;
    try {
      await deletePlan(id);
      toast.success('Plano excluído com sucesso');
      loadPlans();
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao excluir plano';
        toast.error(message);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Planos</h1>
        <Button onClick={() => navigate('/admin/plans/create', { state: { backgroundLocation: location } })}>
          + Novo Plano
        </Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-xl p-4 bg-white shadow min-h-[90px]"
            >
              <div>
                <h2 className="font-semibold text-lg">{plan.name}</h2>
                <p className="text-sm text-gray-600">
                  Até {plan.maxStudents} estudantes - R$ {plan.priceMonthly.toFixed(2)} / mês, R$ {plan.priceYearly.toFixed(2)} / ano
                </p>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/admin/plans/update/${plan.id}`, { state: { backgroundLocation: location } })
                  }
                >
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(plan.id)}>
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;