import { useEffect, useState } from 'react';
import {
  updateCurrentUser,
  getUniversityInfo,
} from '@/api/user';
import {
  changePlan,
  changePaymentMethod,
  cancelUniversityAccess,
} from '../api/universityManagement';
import { useAuthStore } from '@/store/authStore';
import type { UserUpdate } from '@/types/user';
import type { UniversityResponse } from '@/types/university';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import type { Plan } from '@/types/plan';
import type { PaymentMethod } from '@/types/payment';
import { getPlans } from '@/api/plans';
import { getPaymentMethods } from '@/api/payment';
import { showApiMessage } from '@/utils/showApiMessage';

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
  name: z.string().min(3, 'Nome é obrigatório'),
  phone: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (00) 90000-0000'),
  currentPassword: z.string().min(8, 'Senha atual é obrigatória'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

const UserProfile = () => {
  const { user, setAuth } = useAuthStore();
  const [university, setUniversity] = useState<UniversityResponse | null>(null);
  const [planId, setPlanId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [phoneValue, setPhoneValue] = useState(user?.phone || '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      currentPassword: '',
      password: '',
    },
  });

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

  useEffect(() => {
    if (user?.role === 'UNIVERSITY') {
      getUniversityInfo()
        .then(setUniversity)
        .catch((err) => {
          toast.error(err.message || 'Erro ao carregar universidade');
        });
    }
  }, [user]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setValue('phone', masked, { shouldValidate: true });
    setPhoneValue(masked);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload: UserUpdate & { currentPassword: string } = {
        name: data.name,
        phone: data.phone,
        currentPassword: data.currentPassword,
        ...(data.password && data.password.trim() !== '' ? { password: data.password } : {}),
      };

      const updatedUser = await updateCurrentUser(payload);

      toast.success('Dados atualizados com sucesso');

      if (data.password && data.password.trim() !== '') {
        toast.info('Senha alterada. Você será deslogado.');
        setAuth('', null);
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }

      setAuth(localStorage.getItem('access_token')!, updatedUser);
      reset({
        name: updatedUser.name,
        phone: updatedUser.phone,
        currentPassword: '',
        password: '',
      });
      window.location.reload();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || 'Erro ao atualizar dados';
      toast.error(message);
    }
  };

  const handleChangePlan = async () => {
    if (!user?.universityId || !planId) return;
    try {
      setLoading(true);
      const response = await changePlan(user.universityId, Number(planId));
      showApiMessage(response);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao alterar plano';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePayment = async () => {
    if (!user?.universityId || !paymentMethodId) return;
    try {
      setLoading(true);
      const response = await changePaymentMethod(user.universityId, Number(paymentMethodId));
      showApiMessage(response);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao alterar método de pagamento';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAccess = async () => {
    if (!user?.universityId) return;
    if (!confirm('Tem certeza que deseja cancelar o acesso da universidade? Esta ação é irreversível.')) return;

    try {
      await cancelUniversityAccess(user.universityId);
      toast.success('Acesso cancelado');
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao cancelar acesso';
        toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col justify-center py-10">
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-2xl border border-blue-100 p-8">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-7">
          Minha Conta
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2 bg-blue-50 rounded-2xl p-4 mb-7">
          <div>
            <Label htmlFor="name" className="text-blue-900 font-medium">Nome</Label>
            <Input id="name" {...register('name')} className="mt-1" />
            {errors.name && <p className="text-orange-600 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-blue-900 font-medium">Telefone</Label>
            <Input
              id="phone"
              {...register('phone')}
              className="mt-1"
              value={phoneValue}
              onChange={handlePhoneChange}
              maxLength={15}
              placeholder="(00) 90000-0000"
            />
            {errors.phone && <p className="text-orange-600 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-blue-900 font-medium">Email</Label>
            <Input id="email" value={user?.email} readOnly className='bg-gray-200' />
          </div>

          <div>
            <Label htmlFor="cpf" className="text-blue-900 font-medium">CPF</Label>
            <Input id="cpf" value={user?.cpf} readOnly className='bg-gray-200' />
          </div>

          <div>
            <Label htmlFor="university" className="text-blue-900 font-medium">Universidade</Label>
            <Input id="university" value={user?.universityName} readOnly className='bg-gray-200' />
          </div>

          <div>
            <Label htmlFor="role" className="text-blue-900 font-medium">Função</Label>
            <Input id="role" value={user?.role} readOnly className='bg-gray-200' />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="password" className="text-blue-900 font-medium">Nova senha</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-orange-600 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="currentPassword" className="text-blue-900 font-medium">Senha atual</Label>
            <Input id="currentPassword" type="password" {...register('currentPassword')} />
            {errors.currentPassword && (
              <p className="text-orange-600 text-xs mt-1">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg font-bold mt-3 py-2" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        </form>

        {user?.role === 'UNIVERSITY' && university && (
          <div className="border-t pt-6 space-y-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Universidade</h2>
            <div className="grid gap-2 md:grid-cols-2">
              <p><strong>Nome:</strong> {university.name}</p>
              <p><strong>Email:</strong> {university.email}</p>
              <p><strong>CNPJ:</strong> {university.cnpj}</p>
              <p><strong>Plano:</strong> {university.planName}</p>
              <p><strong>Pagamento:</strong> {university.paymentMethod}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan" className="text-blue-900 font-medium">Novo plano</Label>
                <select
                  id="plan"
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-white mt-1"
                >
                  <option value="">Selecione um plano</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                <Button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleChangePlan} disabled={loading}>
                  Alterar plano
                </Button>
              </div>

              <div>
                <Label htmlFor="payment" className="text-blue-900 font-medium">Novo método de pagamento</Label>
                <select
                  id="payment"
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-white mt-1"
                >
                  <option value="">Selecione um método de pagamento</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.type}
                    </option>
                  ))}
                </select>
                <Button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleChangePayment} disabled={loading}>
                  Alterar pagamento
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="destructive" className="w-full" onClick={handleCancelAccess}>
                Cancelar acesso da universidade
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;