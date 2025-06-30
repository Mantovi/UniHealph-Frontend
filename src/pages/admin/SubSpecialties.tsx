import { useEffect, useState } from 'react';
import { activateSubSpecialty, deactivateSubSpecialty, getSubSpecialties } from '@/api/subspecialty';
import type { SubSpecialty } from '@/types/subspecialty';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const SubSpecialties = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [subSpecialties, setSubSpecialties] = useState<SubSpecialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadSubSpecialties = async () => {
    setLoading(true);
    try {
      const data = await getSubSpecialties();
      setSubSpecialties(data);
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao carregar subespecialidades';
        toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    setActionLoadingId(id);
    try {
      if (currentActive) {
        await deactivateSubSpecialty(id);
        toast.success('Subespecialidade desativada');
      } else {
        await activateSubSpecialty(id);
        toast.success('Subespecialidade ativada');
      }
      loadSubSpecialties();
    } catch (error: unknown) {
            const axiosError = error as AxiosError<ApiResponse<null>>;
            const message = axiosError.response?.data?.message ||
            axiosError.message ||
            'Erro ao ativar/desativar subespecialidade';
            toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadSubSpecialties();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Subespecialidades</h1>
        <Button onClick={() => navigate('/admin/sub-specialties/create', { state: { backgroundLocation: location } })}>
          + Nova Subespecialidade
        </Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {subSpecialties.map((s) => (
            <div
              key={s.id}
              className="border rounded-xl p-6 bg-white shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[110px]"
            >
              <div>
                <h2 className="text-lg font-medium">{s.name}</h2>
                <p className="text-sm text-gray-500">
                  Status: <span className={s.active ? "text-green-700" : "text-red-600"}>{s.active ? 'Ativa' : 'Inativa'}</span>
                  {" "}• Categorias: {s.categories?.length ?? 0}
                </p>
              </div>
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate(`/admin/sub-specialties/update/${s.id}`, { state: { backgroundLocation: location } })}
                >
                  Editar
                </Button>
                <Button
                  variant={s.active ? "destructive" : "default"}
                  className="w-full sm:w-auto"
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