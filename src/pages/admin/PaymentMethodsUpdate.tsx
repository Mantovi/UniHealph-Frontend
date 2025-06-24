import { useEffect, useState } from 'react';
import { getPaymentMethods, updatePaymentMethod } from '@/api/payment';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { PaymentMethodRequest } from '@/types/payment';
import PaymentMethodModal from '@/components/PaymentMethodModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

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
          return navigate('/admin/payment-methods');
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
      await updatePaymentMethod(methodId, data);
      toast.success('Método atualizado com sucesso');
      navigate('/admin/payment-methods');
    } catch {
      toast.error('Erro ao atualizar método');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentMethodModal
      open
      onClose={() => navigate('/admin/payment-methods')}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};

export default PaymentMethodsUpdate;
