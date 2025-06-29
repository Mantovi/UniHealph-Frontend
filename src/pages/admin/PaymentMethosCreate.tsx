import { useState } from 'react';
import { createPaymentMethod } from '@/api/payment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { PaymentMethodRequest } from '@/types/payment';
import PaymentMethodModal from '@/components/PaymentMethodModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { ApiResponse } from '@/types/api';
import type { AxiosError } from 'axios';

const PaymentMethodsCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: PaymentMethodRequest) => {
    try {
      setLoading(true);
      const response = await createPaymentMethod(data);
      showApiMessage(response);
      if (response.success) {
        navigate(-1);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao criar método de pagamento';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentMethodModal
      open
      onClose={() => navigate(-1)}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default PaymentMethodsCreate;