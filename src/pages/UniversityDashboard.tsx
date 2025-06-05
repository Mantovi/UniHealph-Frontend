import { useEffect, useState } from 'react';
import {
  getUniversityInfo,
  changeUniversityPlan,
  changeUniversityPaymentMethod,
  cancelUniversityAccess
} from '@/api/universityManagementApi';
import { getPlans, getPaymentMethods } from '@/api/universityApi';
import { UniversityResponse } from '@/types/university';
import { Plan } from '@/types/plan';
import { PaymentMethod } from '@/types/paymentMethod';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/user';
import { getCurrentUser } from '@/api/userApi';

const UniversityDashboard = () => {
  const [info, setInfo] = useState<UniversityResponse | null>(null);
  const [manager, setManager] = useState<User | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoData, plansData, paymentData, userData] = await Promise.all([
          getUniversityInfo(),
          getPlans(),
          getPaymentMethods(),
          getCurrentUser(),
        ]);

        setInfo(infoData);
        setPlans(plansData);
        setPaymentMethods(paymentData);
        setManager(userData);
      } catch (error) {
        console.error('Erro ao carregar dados da universidade', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirmPlanChange = async () => {
    if (!info || !selectedPlanId) return;
    await changeUniversityPlan(info.id, selectedPlanId);
    alert('Plano alterado com sucesso!');
    window.location.reload();
  };

  const handleConfirmPaymentChange = async () => {
    if (!info || !selectedPaymentId) return;
    await changeUniversityPaymentMethod(info.id, selectedPaymentId);
    alert('Método de pagamento alterado com sucesso!');
    window.location.reload();
  };

  const handleCancelAccess = async () => {
    if (!info) return;
    const confirm = window.confirm(
      'Tem certeza que deseja cancelar o acesso da universidade? Todos os dados serão removidos permanentemente.'
    );
    if (!confirm) return;

    await cancelUniversityAccess(info.id);
    alert('Universidade removida com sucesso!');
    logout();
    navigate('/login');
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h2 className='mt-8 font-bold text-2xl'>Painel da Universidade</h2>
      <p><strong>Nome:</strong> {info?.name}</p>
      <p><strong>Email:</strong> {info?.email}</p>
      <p><strong>Plano Atual:</strong> {info?.planName}</p>
      <p><strong>Método de Pagamento:</strong> {info?.paymentMethod}</p>
      <p><strong>Ativa:</strong> {info?.isActive ? 'Sim' : 'Não'}</p>
      <p><strong>____________________________________________________________</strong></p>
      <h3 className="mt-8 font-semibold">Gestor Responsável</h3>
        <p><strong>Nome:</strong> {manager?.name}</p>
        <p><strong>Email:</strong> {manager?.email}</p>
        <p><strong>CPF:</strong> {manager?.cpf}</p>
        <p><strong>Telefone:</strong> {manager?.phone}</p>  

      <div className="mt-6">
        <h3 className="font-semibold">Alterar Plano</h3>
        <select
          className="border p-2 rounded w-full max-w-md"
          value={selectedPlanId ?? ''}
          onChange={(e) => setSelectedPlanId(Number(e.target.value))}
        >
          <option value="" disabled>Selecione novo plano</option>
          {plans.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.name} - {plan.description}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
          disabled={!selectedPlanId}
          onClick={handleConfirmPlanChange}
        >
          Confirmar Alteração de Plano
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Alterar Método de Pagamento</h3>
        <select
          className="border p-2 rounded w-full max-w-md"
          value={selectedPaymentId ?? ''}
          onChange={(e) => setSelectedPaymentId(Number(e.target.value))}
        >
          <option value="" disabled>Selecione novo método</option>
          {paymentMethods.map(method => (
            <option key={method.id} value={method.id}>
              {method.type} - {method.description}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
          disabled={!selectedPaymentId}
          onClick={handleConfirmPaymentChange}
        >
          Confirmar Alteração de Pagamento
        </button>
      </div>

      <div className="mt-10">
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleCancelAccess}>
          Cancelar Acesso da Universidade
        </button>
      </div>
    </div>
  );
};

export default UniversityDashboard;
