import { useEffect, useState } from 'react';
import { activateSubSpecialty, deactivateSubSpecialty, getSubSpecialties } from '@/api/subspecialty';
import type { SubSpecialty } from '@/types/subspecialty';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const SubSpecialties = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [subSpecialties, setSubSpecialties] = useState<SubSpecialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadSubSpecialties = async () => {
    setLoading(true);
    try {
      const data = await getSubSpecialties();
      setSubSpecialties(data);
    } catch {
      toast.error('Erro ao carregar subespecialidades');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    setActionLoadingId(id);
    try {
      if (currentActive) {
        await deactivateSubSpecialty(id);
        toast.success('SubEspecialidade desativada');
      } else {
        await activateSubSpecialty(id);
        toast.success('SubEspecialidade ativada');
      }
      loadSubSpecialties();
    } catch {
      toast.error('Erro ao atualizar status');
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadSubSpecialties();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subespecialidades</h1>
        <Button onClick={() => navigate('/admin/sub-specialties/create')}>+ Nova</Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {subSpecialties.map((s) => (
            <div key={s.id} className="border rounded p-4 bg-white shadow flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">{s.name}</h2>
                <p className="text-sm text-gray-500">
                  Status: {s.active ? 'Ativa' : 'Inativa'} - Categorias: {s.categories?.length ?? 0}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/admin/sub-specialties/update/${s.id}`)}>
                  Editar
                </Button>
                <Button
                  variant={s.active ? "destructive" : "default"}
                  onClick={() => handleToggleActive(s.id, s.active)}
                  disabled={actionLoadingId === s.id}
                >
                  {actionLoadingId === s.id
                    ? 'Aguarde...'
                    : s.active ? 'Desativar' : 'Reativar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubSpecialties;