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

const schema = z.object({
  name: z.string().min(3, 'Nome da universidade é obrigatório'),
  email: z.string().email('Email institucional inválido'),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos numéricos'),
  planId: z.coerce.number().int().positive('Selecione um plano válido'),
  paymentMethodId: z.coerce.number().int().positive('Selecione uma forma de pagamento'),
  managerName: z.string().min(3, 'Nome do gestor é obrigatório'),
  managerEmail: z.string().email('Email do gestor inválido'),
  managerPassword: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  managerCpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  managerPhone: z.string().min(8, 'Telefone inválido'),
});

type FormData = z.infer<typeof schema>;

const UniversityRequest = () => {
const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: PendingUniversityRequest): Promise<void> => {
    try {
      await requestAccess(data);
      toast.success('Solicitação enviada com sucesso');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar solicitação. Verifique os dados ou tente novamente.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-2xl space-y-6">
      <h1 className="text-2xl font-bold text-center">Solicitação de Acesso para Universidade</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome da universidade</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email institucional</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input id="cnpj" placeholder="Somente números" {...register('cnpj')} />
          {errors.cnpj && <p className="text-sm text-red-500">{errors.cnpj.message}</p>}
        </div>

        <div>
          <Label htmlFor="planId">ID do Plano</Label>
          <Input id="planId" type="number" {...register('planId')} />
          {errors.planId && <p className="text-sm text-red-500">{errors.planId.message}</p>}
        </div>

        <div>
          <Label htmlFor="paymentMethodId">ID do Método de Pagamento</Label>
          <Input id="paymentMethodId" type="number" {...register('paymentMethodId')} />
          {errors.paymentMethodId && (
            <p className="text-sm text-red-500">{errors.paymentMethodId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="managerName">Nome do gestor</Label>
          <Input id="managerName" {...register('managerName')} />
          {errors.managerName && <p className="text-sm text-red-500">{errors.managerName.message}</p>}
        </div>

        <div>
          <Label htmlFor="managerEmail">Email do gestor</Label>
          <Input id="managerEmail" type="email" {...register('managerEmail')} />
          {errors.managerEmail && (
            <p className="text-sm text-red-500">{errors.managerEmail.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="managerPassword">Senha</Label>
          <Input id="managerPassword" type="password" {...register('managerPassword')} />
          {errors.managerPassword && (
            <p className="text-sm text-red-500">{errors.managerPassword.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="managerCpf">CPF do gestor</Label>
          <Input id="managerCpf" placeholder="000.000.000-00" {...register('managerCpf')} />
          {errors.managerCpf && <p className="text-sm text-red-500">{errors.managerCpf.message}</p>}
        </div>

        <div>
          <Label htmlFor="managerPhone">Telefone do gestor</Label>
          <Input id="managerPhone" {...register('managerPhone')} />
          {errors.managerPhone && (
            <p className="text-sm text-red-500">{errors.managerPhone.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UniversityRequest;