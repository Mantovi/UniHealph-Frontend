import React, { useState, useEffect } from 'react';
import { getPlans, getPaymentMethods } from '../api/universityApi';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {PendingUniversityRequest } from '../types/university';
import { Plan } from '../types/plan';
import { PaymentMethod } from '../types/paymentMethod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UniversityRequest = () => {
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [planId, setPlanId] = useState<number | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);

  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [managerCpf, setManagerCpf] = useState('');
  const [managerPhone, setManagerPhone] = useState('');

  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const plansData = await getPlans();
      const paymentMethodsData = await getPaymentMethods();
      setPlans(plansData);
      setPaymentMethods(paymentMethodsData);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData: PendingUniversityRequest = {
      name,
      email,
      cnpj,
      planId: planId || 0,
      paymentMethodId: paymentMethodId || 0,
      managerName,
      managerEmail,
      managerPassword,
      managerCpf,
      managerPhone,
    };

    try {
      const response = await api.post('/api/public/universities/request', requestData);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao enviar solicitação', error);
      alert('Erro ao enviar a solicitação');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="flex items-center justify-between mb-6">
        <Button variant="link" onClick={() => navigate('/login')}>
          Voltar ao Login
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">Solicitação de Acesso</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <Input
              type="text"
              placeholder="Nome da Universidade"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email da Universidade"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            />
            <select
              value={planId || ''}
              onChange={(e) => setPlanId(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione o Plano</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
            <select
              value={paymentMethodId || ''}
              onChange={(e) => setPaymentMethodId(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione o Método de Pagamento</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.type}
                </option>
              ))}
            </select>
            <Button type="button" className="w-full" onClick={() => setStep(2)}>
              Próximo
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Informações do Gestor</h3>
            <Input
              type="text"
              placeholder="Nome do Gestor"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email do Gestor"
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha do Gestor"
              value={managerPassword}
              onChange={(e) => setManagerPassword(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="CPF do Gestor"
              value={managerCpf}
              onChange={(e) => setManagerCpf(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Telefone do Gestor"
              value={managerPhone}
              onChange={(e) => setManagerPhone(e.target.value)}
              required
            />

            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep(1)}
              >
                Voltar
              </Button>
            </div>
            <div className='flex justify-between gap-4'>
              <Button type="submit" className="w-full">
                Enviar Solicitação
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default UniversityRequest;