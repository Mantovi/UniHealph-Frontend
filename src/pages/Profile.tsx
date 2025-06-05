import { useEffect, useState } from 'react';
import { getCurrentUser, updateCurrentUser } from '@/api/userApi';
import { User } from '@/types/user';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  const [editingField, setEditingField] = useState<'name' | 'phone' | 'password' | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getCurrentUser();
      setUser(data);
      setName(data.name);
      setPhone(data.phone);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField || !user) return;

    try {
      const updatePayload =
        editingField === 'name'
          ? { name, phone: user.phone, password: '' }
          : editingField === 'phone'
          ? { name: user.name, phone, password: '' }
          : { name: user.name, phone: user.phone, password };

      const updated = await updateCurrentUser(updatePayload);
      setUser(updated);
      setEditingField(null);
      setPassword('');
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      setMessage('Erro ao atualizar perfil');
    }
  };

  if (!user) return <p>Carregando perfil...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Meu Perfil</h2>

      {message && <p className="text-green-600 mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label className="block font-medium">Nome:</label>
          {editingField === 'name' ? (
            <input
              className="border p-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{user.name}</span>
              <button type="button" onClick={() => setEditingField('name')} className="text-blue-600">Alterar</button>
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium">Email:</label>
          <span>{user.email}</span>
        </div>

        <div>
          <label className="block font-medium">CPF:</label>
          <span>{user.cpf}</span>
        </div>

        <div>
          <label className="block font-medium">Telefone:</label>
          {editingField === 'phone' ? (
            <input
              className="border p-2 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{user.phone}</span>
              <button type="button" onClick={() => setEditingField('phone')} className="text-blue-600">Alterar</button>
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium">Senha:</label>
          {editingField === 'password' ? (
            <input
              type="password"
              className="border p-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>••••••••</span>
              <button type="button" onClick={() => setEditingField('password')} className="text-blue-600">Alterar</button>
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium">Perfil:</label>
          <span>{user.role}</span>
        </div>

        <div>
          <label className="block font-medium">Universidade:</label>
          <span>{user.universityName ?? 'Sem Universidade'}</span>
        </div>

        <div>
          <label className="block font-medium">Pontos:</label>
          <span>{user.points}</span>
        </div>

        {editingField && (
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Atualizar Perfil
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;
