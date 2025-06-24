import { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '@/api/category';
import type { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const Categories = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
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

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir esta categoria?')) return;
    try {
      await deleteCategory(id);
      toast.success('Categoria excluída');
      load();
    } catch {
      toast.error('Erro ao excluir categoria');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button onClick={() => navigate('/admin/categories/create')}>+ Nova Categoria</Button>
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
                <Button variant="outline" onClick={() => navigate(`/admin/categories/update/${c.id}`)}>Editar</Button>
                <Button variant="destructive" onClick={() => handleDelete(c.id)}>Excluir</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;