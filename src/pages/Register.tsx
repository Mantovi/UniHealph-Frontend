import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RegisterRequest } from '../types/auth';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import { ArrowLeftCircle, University } from 'lucide-react';
import Logo from '@/assets/Logo com fundo.jpg';

const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;

const schema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
  phone: z
    .string()
    .regex(phoneRegex, 'Telefone deve estar no formato (00) 00000-0000'),
});

type FormData = z.infer<typeof schema>;

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

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },

    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const cpfValue = watch('cpf') || '';
  const phoneValue = watch('phone') || '';

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCpf(e.target.value);
    setValue('cpf', masked, { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setValue('phone', masked, { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterRequest): Promise<void> => {
    try {
      const res = await registerUser(data);
      toast.success(res.message || 'Cadastro realizado com sucesso');
      navigate('/login');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || 'Erro ao cadastrar';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full p-7 bg-white shadow-2xl rounded-3xl border border-blue-100 relative">
        
        <button
          type="button"
          className="absolute top-6 left-6 flex items-center gap-1 text-emerald-500 hover:text-emerald-700 font-medium"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <ArrowLeftCircle size={20} />
          Voltar
        </button>

        <div className="mb-4 text-center">
          <div className="mt-4 flex justify-center">
            <img
              src={Logo}
              alt="Logo Uni-Healph"
              className="h-12 md:h-12 object-contain"
            />
          </div>
        </div>

        <h1 className="text-xl font-semibold mb-6 text-center text-blue-900">
          Criar conta na Uni-Healph
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-blue-900 font-medium">Nome completo</Label>
            <Input id="name" {...register('name')} autoFocus className="mt-1" />
            {errors.name && (
              <p className="text-orange-600 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-blue-900 font-medium">Email institucional</Label>
            <Input id="email" type="email" {...register('email')} className="mt-1" />
            {errors.email && (
              <p className="text-orange-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cpf" className="text-blue-900 font-medium">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              {...register('cpf')}
              className="mt-1"
              inputMode="numeric"
              maxLength={14}
              value={cpfValue}
              onChange={handleCpfChange}
            />
            {errors.cpf && (
              <p className="text-orange-600 text-xs mt-1">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-blue-900 font-medium">Telefone</Label>
            <Input
              id="phone"
              placeholder="(00) 90000-0000"
              {...register('phone')}
              className="mt-1"
              inputMode="tel"
              maxLength={15}
              value={phoneValue}
              onChange={handlePhoneChange}
            />
            {errors.phone && (
              <p className="text-orange-600 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-blue-900 font-medium">Senha</Label>
            <Input id="password" type="password" {...register('password')} className="mt-1" />
            {errors.password && (
              <p className="text-orange-600 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg font-bold mt-3 py-2"
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <div className="flex flex-col gap-2 mt-7">
          <Button
            type="button"
            variant="secondary"
            className="w-full bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold flex items-center justify-center gap-2"
            onClick={() => navigate('/university-request')}
          >
            <University size={18} className="text-blue-800" />
            Registrar universidade
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Register;