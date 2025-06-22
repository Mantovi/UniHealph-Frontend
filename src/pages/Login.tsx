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
  } catch (error) {
    console.error(error);
    toast.error('Credenciais inválidas');
  }
};

    return (
        <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow-xl rounded-2xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Entrar na Uni-Healph</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
    );
}

export default Login;