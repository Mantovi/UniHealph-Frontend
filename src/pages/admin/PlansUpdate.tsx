import { useEffect, useState } from "react";
import { getPlans, updatePlan } from "@/api/plans";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { PlanRequest } from "@/types/plan";
import PlanModal from "@/components/PlanModal";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import type { Role } from "@/types/user";
import { showApiMessage } from "@/utils/showApiMessage";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types/api";

const PlansUpdate = () => {
  const REQUIRED_ROLE: Role = "ADMIN";
  useRoleGuard(REQUIRED_ROLE);

  const { id } = useParams<{ id: string }>();
  const planId = Number(id);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<PlanRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const plans = await getPlans();
        const found = plans.find((plan) => plan.id === planId);
        if (!found) {
          toast.error("Plano não encontrado");
          navigate("/admin/plans");
          return;
        }
        setInitialData({
          name: found.name,
          maxStudents: found.maxStudents,
          priceMonthly: found.priceMonthly,
          priceYearly: found.priceYearly,
          description: found.description,
        });
      } catch {
        toast.error("Erro ao carregar plano");
        navigate("/admin/plans");
      }
    };
    load();
  }, [planId, navigate]);

  const handleUpdate = async (data: PlanRequest) => {
    try {
      setLoading(true);
      const response = await updatePlan(planId, data);
      showApiMessage(response, { successMessage: "Plano atualizado com sucesso" });
      if (response.success) {
        navigate(-1);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Erro ao atualizar plano";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return null;

  return (
    <PlanModal
      open
      onClose={() => navigate(-1)}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};

export default PlansUpdate;