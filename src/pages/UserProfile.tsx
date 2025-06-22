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

const schema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  phone: z.string().min(8, 'Telefone inválido'),
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
  if (user?.role === 'UNIVERSITY') {
    getUniversityInfo()
      .then(setUniversity)
      .catch((err) => {
        console.error('Erro ao buscar universidade:', err);
        toast.error(err.message || 'Erro ao carregar universidade');
      });
  }
}, [user]);


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

    if (data.name !== user?.name || data.phone !== user?.phone) {
      setAuth(localStorage.getItem('access_token')!, updatedUser);
      reset({
        name: updatedUser.name,
        phone: updatedUser.phone,
        currentPassword: '',
        password: '',
      });
      window.location.reload();
      return;
    }

    setAuth(localStorage.getItem('access_token')!, updatedUser);
    reset({
      name: updatedUser.name,
      phone: updatedUser.phone,
      currentPassword: '',
      password: '',
    });
  } catch (error) {
    const AxiosError = error as AxiosError<ApiResponse<null>>;
    const message = AxiosError.response?.data?.message || 'Erro ao atualizar dados';
    toast.error(message);
  }
};



  const handleChangePlan = async () => {
    if (!user?.universityId || !planId) return;
    try {
      setLoading(true);
      await changePlan(user.universityId, Number(planId));
      toast.success('Plano alterado com sucesso');
    } catch {
      toast.error('Erro ao alterar plano');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePayment = async () => {
    if (!user?.universityId || !paymentMethodId) return;
    try {
      setLoading(true);
      await changePaymentMethod(user.universityId, Number(paymentMethodId));
      toast.success('Método de pagamento alterado');
    } catch {
      toast.error('Erro ao alterar pagamento');
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
    } catch {
      toast.error('Erro ao cancelar acesso');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-center">Minha Conta</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" {...register('phone')} />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="md:col-span-2">
            <Label htmlFor="password">Nova senha</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="md:col-span-2">
            <Label htmlFor="currentPassword">Senha atual</Label>
            <Input id="currentPassword" type="password" {...register('currentPassword')} />
            {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
            )}
        </div>


        <div className="md:col-span-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            </Button>
        </div>
      </form>

      {user?.role === 'UNIVERSITY' && university && (
        <div className="border-t pt-6 space-y-6">
          <h2 className="text-xl font-semibold">Universidade</h2>
            <p><strong>Nome:</strong> {university.name}</p>
            <p><strong>Email:</strong> {university.email}</p>
            <p><strong>CNPJ:</strong> {university.cnpj}</p>
            <p><strong>Plano:</strong> {university.planName}</p>
            <p><strong>Pagamento:</strong> {university.paymentMethod}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="plan">Novo plano (ID)</Label>
                <Input id="plan" value={planId} onChange={(e) => setPlanId(e.target.value)} />
                <Button className="mt-2 w-full" onClick={handleChangePlan} disabled={loading}>
                    Alterar plano
                </Button>
            </div>

            <div>
                <Label htmlFor="payment">Novo método de pagamento (ID)</Label>
                <Input id="payment" value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)} />
                <Button className="mt-2 w-full" onClick={handleChangePayment} disabled={loading}>
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
  );
}

export default UserProfile;