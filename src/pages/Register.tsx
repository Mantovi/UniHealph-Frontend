import { useState } from 'react';
import { register } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await register({ email, password, name, cpf, phone });
      if (response) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro ao registrar', error);
    }
  };

    const handleBack = () => {
    navigate(-1);
  };

return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="flex items-center justify-between mb-6">
        <Button
          className="w-10 h-10 text-white bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600"
          onClick={handleBack}
        >
          ←
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">Registrar</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          required
        />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <Input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF"
          required
        />
        <Input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefone"
          required
        />
        <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Registrar
        </Button>
        <Button
          className="text-blue-600 hover:underline p-0 w-full"
          variant="link"
          onClick={() => navigate('/request')}
        >
          Cadastrar Universidade
        </Button>
      </form>
    </div>
  );
};

export default Register;
