import { useEffect, useState } from 'react';
import { activateSpecialty, deactivateSpecialty, getSpecialties } from '@/api/specialty';
import type { Specialty } from '@/types/specialty';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const Specialties = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    setActionLoadingId(id);
    try {
      if (currentActive) {
        await deactivateSpecialty(id);
        toast.success('Especialidade desativada');
      } else {
        await activateSpecialty(id);
        toast.success('Especialidade ativada');
      }
      loadSpecialties();
    } catch {
      toast.error('Erro ao atualizar status');
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadSpecialties();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Especialidades</h1>
        <Button onClick={() => navigate('/admin/specialties/create', { state: { backgroundLocation: location } })}>
          + Nova Especialidade
        </Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {specialties.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-6 bg-white shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[110px]"
            >
              <div>
                <h2 className="text-lg font-medium">{item.name}</h2>
                <p className="text-sm text-gray-500">
                  Status: <span className={item.active ? "text-green-700" : "text-red-600"}>{item.active ? 'Ativa' : 'Inativa'}</span>
                  {" "}• Subespecialidades: {item.subSpecialties.length}
                </p>
              </div>
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate(`/admin/specialties/update/${item.id}`, { state: { backgroundLocation: location } })}
                >
                  Editar
                </Button>
                <Button
                  variant={item.active ? "destructive" : "default"}
                  className="w-full sm:w-auto"
                  onClick={() => handleToggleActive(item.id, item.active)}
                  disabled={actionLoadingId === item.id}
                >
                  {actionLoadingId === item.id
                    ? 'Aguarde...'
                    : item.active ? 'Desativar' : 'Reativar'}
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