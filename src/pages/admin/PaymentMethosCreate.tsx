import { useState } from 'react';
import { createPaymentMethod } from '@/api/payment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { PaymentMethodRequest } from '@/types/payment';
import PaymentMethodModal from '@/components/PaymentMethodModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const PaymentMethodsCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: PaymentMethodRequest) => {
    try {
      setLoading(true);
      await createPaymentMethod(data);
      toast.success('Método criado com sucesso');
      navigate('/admin/payment-methods');
    } catch {
      toast.error('Erro ao criar método');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentMethodModal
      open
      onClose={() => navigate('/admin/payment-methods')}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default PaymentMethodsCreate;