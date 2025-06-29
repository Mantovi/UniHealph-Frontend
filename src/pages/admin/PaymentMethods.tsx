import { useEffect, useState } from 'react';
import { getPaymentMethods, deletePaymentMethod } from '@/api/payment';
import type { PaymentMethod } from '@/types/payment';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const PaymentMethods = () => {
    const REQUIRED_ROLE: Role = 'ADMIN';
    useRoleGuard(REQUIRED_ROLE);
    
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const loadMethods = async () => {
    setLoading(true);
    try {
      const data = await getPaymentMethods();
      setMethods(data);
    } catch {
      toast.error('Erro ao carregar métodos de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este método?')) return;
    try {
      await deletePaymentMethod(id);
      toast.success('Método excluído');
      loadMethods();
    } catch {
      toast.error('Erro ao excluir');
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Métodos de Pagamento</h1>
        <Button onClick={() => navigate('/admin/payment-methods/create', { state: { backgroundLocation: location } })}>+ Novo Método</Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {methods.map((method) => (
            <div key={method.id} className="border rounded p-4 bg-white shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg">{method.type}</h2>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate(`/admin/payment-methods/update/${method.id}`, { state: { backgroundLocation: location } })}>
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(method.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;