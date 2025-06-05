import React, { useState, useEffect } from 'react';
import { getPlans, getPaymentMethods } from '../api/universityApi';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {PendingUniversityRequest } from '../types/university';
import { Plan } from '../types/plan';
import { PaymentMethod } from '../types/paymentMethod';

const UniversityRequest = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [managerCpf, setManagerCpf] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [planId, setPlanId] = useState<number | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
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
    <div>
      <h2>Solicitação de Acesso para Universidade</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Universidade"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="CNPJ"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          required
        />
        <select value={planId || ''} onChange={(e) => setPlanId(Number(e.target.value))} required>
          <option value="">Selecione o Plano</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
        <select value={paymentMethodId || ''} onChange={(e) => setPaymentMethodId(Number(e.target.value))} required>
          <option value="">Selecione o Método de Pagamento</option>
          {paymentMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.type}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nome do Gestor"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email do Gestor"
          value={managerEmail}
          onChange={(e) => setManagerEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha do Gestor"
          value={managerPassword}
          onChange={(e) => setManagerPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="CPF do Gestor"
          value={managerCpf}
          onChange={(e) => setManagerCpf(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Telefone do Gestor"
          value={managerPhone}
          onChange={(e) => setManagerPhone(e.target.value)}
          required
        />
        <button type="submit">Enviar Solicitação</button>
      </form>
    </div>
  );
};

export default UniversityRequest;