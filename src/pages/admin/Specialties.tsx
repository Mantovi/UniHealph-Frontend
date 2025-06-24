import { useEffect, useState } from 'react';
import { getSpecialties, deleteSpecialty } from '@/api/specialty';
import type { Specialty } from '@/types/specialty';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const Specialties = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadSpecialties = async () => {
    setLoading(true);
    try {
      const data = await getSpecialties();
      setSpecialties(data);
    } catch {
      toast.error('Erro ao carregar especialidades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir esta especialidade?')) return;
    try {
      await deleteSpecialty(id);
      toast.success('Especialidade excluída');
      loadSpecialties();
    } catch {
      toast.error('Erro ao excluir');
    }
  };

  useEffect(() => {
    loadSpecialties();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Especialidades</h1>
        <Button onClick={() => navigate('/admin/specialties/create')}>
          + Nova Especialidade
        </Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {specialties.map((item) => (
            <div key={item.id} className="border rounded p-4 bg-white shadow flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">{item.name}</h2>
                <p className="text-sm text-gray-500">
                  Status: {item.active ? 'Ativa' : 'Inativa'} - Subespecialidades: {item.subSpecialties.length}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/specialties/update/${item.id}`)}
                >
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Specialties;