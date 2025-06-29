import { useEffect, useState } from 'react';
import { getPaymentMethods, updatePaymentMethod } from '@/api/payment';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { PaymentMethodRequest } from '@/types/payment';
import PaymentMethodModal from '@/components/PaymentMethodModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const PaymentMethodsUpdate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const { id } = useParams();
  const navigate = useNavigate();
  const methodId = Number(id);

  const [initialData, setInitialData] = useState<PaymentMethodRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getPaymentMethods();
        const found = all.find((m) => m.id === methodId);
        if (!found) {
          toast.error('Método não encontrado');
          return navigate(-1);
        }
        setInitialData({ type: found.type, description: found.description });
      } catch {
        toast.error('Erro ao carregar método');
      }
    };
    load();
  }, [methodId, navigate]);

  const handleUpdate = async (data: PaymentMethodRequest) => {
    try {
      setLoading(true);
      const response = await updatePaymentMethod(methodId, data);
      showApiMessage(response);
      if (response.success) {
        navigate(-1);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao atualizar método de pagamento';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentMethodModal
      open
      onClose={() => navigate(-1)}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};

export default PaymentMethodsUpdate;
