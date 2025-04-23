import { useState } from 'react';
import { RegisterForm } from '@/types/auth';
import AuthFormWrapper from '@/components/AuthFormWrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    name: '', email: '', cpf: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (element: React.ChangeEvent<HTMLInputElement>) => 
    setForm((form) => ({ ...form, [element.target.name]: element.target.value }));
  
  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();
    try {
        await authService.register(form);
        navigate('/login');
    } catch (err) {
        console.error('Erro ao registrar',err);
        setError('Falha ao registrar, verifique se os dados estão corretos');
    }
  };

  return (
    <AuthFormWrapper title="Criar Conta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Nome completo" value={form.name} onChange={handleChange} required />
        <Input name="email" type="email" placeholder="E-mail institucional" value={form.email} onChange={handleChange} required />
        <Input name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} required />
        <Input name="phone" placeholder="Telefone" value={form.phone} onChange={handleChange} required />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="w-full"> Registrar </Button>
      </form>
    </AuthFormWrapper>
  );
};

export default Register;
