import { useState } from 'react';
import { RegisterForm } from '@/types/auth';
import AuthFormWrapper from '@/components/AuthFormWrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    cpf: '',
    password: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registro enviado:', form);
    // Aqui virá a integração com /auth/register
  };

  return (
    <AuthFormWrapper title="Criar Conta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Nome completo" value={form.name} onChange={handleChange} required />
        <Input name="email" type="email" placeholder="E-mail institucional" value={form.email} onChange={handleChange} required />
        <Input name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} required />
        <Input name="phone" placeholder="Telefone" value={form.phone} onChange={handleChange} required />
        <Button type="submit" className="w-full">
          Registrar
        </Button>
      </form>
    </AuthFormWrapper>
  );
};

export default Register;
