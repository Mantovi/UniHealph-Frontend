import { useEffect, useState } from 'react';
import { activateCategory, deactivateCategory, getCategories } from '@/api/category';
import type { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

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
    } catch {
      toast.error('Erro ao carregar categorias');
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
    } catch {
      toast.error('Erro ao atualizar status');
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button onClick={() => navigate('/admin/categories/create', { state: { backgroundLocation: location } })}>+ Nova Categoria</Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {categories.map((c) => (
            <div key={c.id} className="border rounded p-4 bg-white shadow flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">{c.name}</h2>
                <p className="text-sm text-gray-500">
                  Status: {c.active ? 'Ativa' : 'Inativa'} - Tipos de produtos: {c.productTypes?.length ?? 0}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/admin/categories/update/${c.id}`, { state: { backgroundLocation: location } })}>Editar</Button>
                <Button
                  variant={c.active ? "destructive" : "default"}
                  onClick={() => handleToggleActive(c.id, c.active)}
                  disabled={actionLoadingId === c.id}
                >
                  {actionLoadingId === c.id
                    ? 'Aguarde...'
                    : c.active ? 'Desativar' : 'Reativar'}
                </Button>              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;