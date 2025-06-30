import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import type { LoginRequest } from '../types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import { University } from 'lucide-react';

const schema = z.object({
    email: z.string().email({message: "Email inválido"}),
    password: z.string().min(8, {message: "Senha deve conter no mínimo 8 caracteres"}),
})

type FormData = z.infer<typeof schema>;
const Login = () => {
    const {setAuth} = useAuthStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

const onSubmit = async (data: LoginRequest): Promise<void> => {
  try {
    const response = await login(data);

    if (response && response.token && response.user) {
      setAuth(response.token, response.user);
      toast.success('Login realizado com sucesso');
      navigate('/products');
    } else {
      toast.error('Resposta inválida do servidor');
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    const message = axiosError.response?.data?.message || axiosError.message || 'Erro ao fazer login';
    toast.error(message);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col justify-center">
      <div className="max-w-sm mx-auto w-full p-7 bg-white shadow-2xl rounded-3xl border border-blue-100">
        
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight leading-tight">
            Bem-vindo à
          </h2>
          <div className="inline-block mt-1 px-4 py-1 bg-blue-100 rounded-full shadow text-2xl font-bold text-blue-700 tracking-wide">
            Uni<span className="text-emerald-600">+</span>Healph
          </div>
        </div>

        <h1 className="text-xl font-semibold mb-6 text-center text-blue-800">
          Entrar na plataforma
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-blue-900 font-medium">Email</Label>
            <Input id="email" type="email" {...register('email')} autoFocus className="mt-1" />
            {errors.email && (
              <p className="text-orange-600 text-xs mt-1">{errors.email.message}</p>
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
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
                <div className="flex flex-col gap-3 mt-7">
          <Button
            type="button"
            variant="outline"
            className="w-full border-blue-300 text-blue-800 font-semibold"
            onClick={() => navigate('/register')}
          >
            Cadastrar-se
          </Button>
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

export default Login;