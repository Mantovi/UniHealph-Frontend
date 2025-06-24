import { useEffect, useState } from 'react';
import { getProductTypes, deleteProductType } from '@/api/productType';
import type { ProductType } from '@/types/productType';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const ProductTypes = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProductTypes();
      setTypes(data);
    } catch {
      toast.error('Erro ao carregar tipos de produto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este tipo de produto?')) return;
    try {
      await deleteProductType(id);
      toast.success('Tipo excluído');
      load();
    } catch {
      toast.error('Erro ao excluir tipo');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tipos de Produto</h1>
        <Button onClick={() => navigate('/admin/product-types/create')}>+ Novo Tipo</Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {types.map((t) => (
            <div key={t.id} className="border rounded p-4 bg-white shadow flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">{t.name}</h2>
                <p className="text-sm text-gray-500">
                  Status: {t.active ? 'Ativo' : 'Inativo'} - Produtos: {t.products?.length || 0} </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/admin/product-types/update/${t.id}`)}>Editar</Button>
                <Button variant="destructive" onClick={() => handleDelete(t.id)}>Excluir</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTypes;