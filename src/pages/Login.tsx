import { useState } from 'react';
import { LoginForm } from '@/types/auth';
import AuthFormWrapper from '@/components/AuthFormWrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (element: React.ChangeEvent<HTMLInputElement>) => 
    setForm((form) => ({ ...form, [element.target.name]: element.target.value }));
  

  const handleSubmit = async(element: React.FormEvent) => {
    element.preventDefault();
    setError('')
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        if (!response.ok) throw new Error('Login inválido');
        const { token } = await response.json();
        auth.login(token);

        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log("Decoded JWT:", decoded);
        decoded.role = navigate('/');
        
    } catch {
        setError('Login inválido');
    }
}

  return (
    <AuthFormWrapper title="Login">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} required/>
        <Input
          name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} required />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="w-full">Entrar</Button>
      </form>
    </AuthFormWrapper>
  );
};

export default Login;
