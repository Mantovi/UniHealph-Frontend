import { useEffect, useState } from 'react';
import { activateCategory, deactivateCategory, getCategories } from '@/api/category';
import type { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const Categories = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao carregar categorias';
        toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    setActionLoadingId(id);
    try {
      if (currentActive) {
        await deactivateCategory(id);
        toast.success('Categoria desativada');
      } else {
        await activateCategory(id);
        toast.success('Categoria ativada');
      }
      loadCategories();
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao ativar/desativar categoria';
        toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button onClick={() => navigate('/admin/categories/create', { state: { backgroundLocation: location } })}>
          + Nova Categoria
        </Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl p-6 bg-white shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[110px] transition-all"
            >
              <div className="flex-1">
                <h2 className="text-lg font-medium">{c.name}</h2>
                <p className="text-sm text-gray-500">
                  Status: <span className={c.active ? "text-green-700" : "text-red-600"}>{c.active ? 'Ativa' : 'Inativa'}</span>
                  {" "}• Tipos de produtos: {c.productTypes?.length ?? 0}
                </p>
              </div>
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate(`/admin/categories/update/${c.id}`, { state: { backgroundLocation: location } })}
                >
                  Editar
                </Button>
                <Button
                  variant={c.active ? "destructive" : "default"}
                  className="w-full sm:w-auto"
                  onClick={() => handleToggleActive(c.id, c.active)}
                  disabled={actionLoadingId === c.id}
                >
                  {actionLoadingId === c.id
                    ? 'Aguarde...'
                    : c.active ? 'Desativar' : 'Reativar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;