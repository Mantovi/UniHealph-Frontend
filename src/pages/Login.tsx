import { useState } from 'react';
import { LoginForm } from '@/types/auth';
import AuthFormWrapper from '@/components/AuthFormWrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login enviado:', form);
    // Aqui virá a integração com /auth/login
  };

  return (
    <AuthFormWrapper title="Login">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </AuthFormWrapper>
  );
};

export default Login;
