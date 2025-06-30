import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestAccess } from '@/api/universityRequest';
import type { PendingUniversityRequest } from '@/types/university-request';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import { ArrowLeftCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Plan } from '@/types/plan';
import type { PaymentMethod } from '@/types/payment';
import { getPlans } from '@/api/plans';
import { getPaymentMethods } from '@/api/payment';

function maskCnpj(value: string): string {
  value = value.replace(/\D/g, '');
  if (value.length > 14) value = value.slice(0, 14);
  if (value.length > 12) return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, "$1.$2.$3/$4-$5");
  else if (value.length > 8) return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
  else if (value.length > 5) return value.replace(/^(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
  else if (value.length > 2) return value.replace(/^(\d{2})(\d{0,3})/, "$1.$2");
  return value;
}

function maskCpf(value: string): string {
  value = value.replace(/\D/g, "");
  if (value.length > 9)
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
  else if (value.length > 6)
    return value.replace(/^(\d{3})(\d{3})(\d{1,3}).*/, "$1.$2.$3");
  else if (value.length > 3)
    return value.replace(/^(\d{3})(\d{1,3}).*/, "$1.$2");
  return value;
}

function maskPhone(value: string): string {
  value = value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length > 6) {
    return value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "");
  } else if (value.length > 2) {
    return value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    return value.replace(/^(\d*)/, "($1");
  }
}

const schema = z.object({
  name: z.string().min(3, 'Nome da universidade é obrigatório'),
  email: z.string().email('Email institucional inválido'),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato 00.000.000/0000-00'),
  planId: z.coerce.number().int().positive('Selecione um plano válido'),
  paymentMethodId: z.coerce.number().int().positive('Selecione uma forma de pagamento'),
  managerName: z.string().min(3, 'Nome do gestor é obrigatório'),
  managerEmail: z.string().email('Email do gestor inválido'),
  managerPassword: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  managerCpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
  managerPhone: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (00) 90000-0000'),
});

type FormData = z.infer<typeof schema>;

const UniversityRequest = () => {
  const navigate = useNavigate();
  const [cnpjValue, setCnpjValue] = useState('');
  const [managerCpfValue, setManagerCpfValue] = useState('');
  const [managerPhoneValue, setManagerPhoneValue] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [fetchedPlans, fetchedPayments] = await Promise.all([
          getPlans(),
          getPaymentMethods(),
        ]);
        setPlans(fetchedPlans);
        setPaymentMethods(fetchedPayments);
      } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Erro ao carregar opções';
        toast.error(message);
      }
    }
    fetchOptions();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCnpj(e.target.value);
    setValue('cnpj', masked, { shouldValidate: true });
    setCnpjValue(masked);
  };
  const handleManagerCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCpf(e.target.value);
    setValue('managerCpf', masked, { shouldValidate: true });
    setManagerCpfValue(masked);
  };
  const handleManagerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setValue('managerPhone', masked, { shouldValidate: true });
    setManagerPhoneValue(masked);
  };

  const onSubmit = async (data: PendingUniversityRequest): Promise<void> => {
    try {
      const response = await requestAccess(data);
      showApiMessage(response);
      if (response.success) {
        navigate('/login');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || axiosError.message || 'Erro ao solicitar acesso para universidade';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full p-8 bg-white shadow-2xl rounded-3xl border border-blue-100 relative">
        
        <button
          type="button"
          className="absolute top-7 left-7 flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <ArrowLeftCircle size={22} />
          Voltar
        </button>

        <div className="mb-4 text-center">
          <div className="inline-block px-4 py-1 bg-blue-100 rounded-full shadow text-2xl font-bold text-blue-700 tracking-wide">
            Uni<span className="text-emerald-600">+</span>Healph
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-7 text-center text-blue-900">
          Solicitação de Acesso para Universidade
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name" className="text-blue-900 font-medium">Nome da universidade</Label>
            <Input id="name" {...register('name')} autoFocus className="mt-1" />
            {errors.name && <p className="text-orange-600 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-blue-900 font-medium">Email institucional</Label>
            <Input id="email" type="email" {...register('email')} className="mt-1" />
            {errors.email && <p className="text-orange-600 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="cnpj" className="text-blue-900 font-medium">CNPJ</Label>
            <Input
              id="cnpj"
              placeholder="00.000.000/0000-00"
              {...register('cnpj')}
              className="mt-1"
              inputMode="numeric"
              maxLength={18}
              value={cnpjValue}
              onChange={handleCnpjChange}
            />
            {errors.cnpj && <p className="text-orange-600 text-xs mt-1">{errors.cnpj.message}</p>}
          </div>

          <div>
            <Label htmlFor="planId" className="text-blue-900 font-medium">Plano</Label>
            <select
              id="planId"
              {...register('planId', { valueAsNumber: true })}
              className="mt-1 w-full border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>Selecione um plano</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
            {errors.planId && <p className="text-orange-600 text-xs mt-1">{errors.planId.message}</p>}
          </div>

          <div>
            <Label htmlFor="paymentMethodId" className="text-blue-900 font-medium">Método de Pagamento</Label>
            <select
              id="paymentMethodId"
              {...register('paymentMethodId', { valueAsNumber: true })}
              className="mt-1 w-full border rounded px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>Selecione um método de pagamento</option>
              {paymentMethods.map(method => (
                <option key={method.id} value={method.id}>
                  {method.type}
                </option>
              ))}
            </select>
            {errors.paymentMethodId && <p className="text-orange-600 text-xs mt-1">{errors.paymentMethodId.message}</p>}
          </div>

          <div>
            <Label htmlFor="managerName" className="text-blue-900 font-medium">Nome do gestor</Label>
            <Input id="managerName" {...register('managerName')} className="mt-1" />
            {errors.managerName && <p className="text-orange-600 text-xs mt-1">{errors.managerName.message}</p>}
          </div>

          <div>
            <Label htmlFor="managerEmail" className="text-blue-900 font-medium">Email do gestor</Label>
            <Input id="managerEmail" type="email" {...register('managerEmail')} className="mt-1" />
            {errors.managerEmail && (
              <p className="text-orange-600 text-xs mt-1">{errors.managerEmail.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="managerPassword" className="text-blue-900 font-medium">Senha do gestor</Label>
            <Input id="managerPassword" type="password" {...register('managerPassword')} className="mt-1" />
            {errors.managerPassword && (
              <p className="text-orange-600 text-xs mt-1">{errors.managerPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="managerCpf" className="text-blue-900 font-medium">CPF do gestor</Label>
            <Input
              id="managerCpf"
              placeholder="000.000.000-00"
              {...register('managerCpf')}
              className="mt-1"
              inputMode="numeric"
              maxLength={14}
              value={managerCpfValue}
              onChange={handleManagerCpfChange}
            />
            {errors.managerCpf && <p className="text-orange-600 text-xs mt-1">{errors.managerCpf.message}</p>}
          </div>

          <div>
            <Label htmlFor="managerPhone" className="text-blue-900 font-medium">Telefone do gestor</Label>
            <Input
              id="managerPhone"
              placeholder="(00) 90000-0000"
              {...register('managerPhone')}
              className="mt-1"
              inputMode="tel"
              maxLength={15}
              value={managerPhoneValue}
              onChange={handleManagerPhoneChange}
            />
            {errors.managerPhone && (
              <p className="text-orange-600 text-xs mt-1">{errors.managerPhone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg font-bold mt-3 py-2">
              {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversityRequest;
