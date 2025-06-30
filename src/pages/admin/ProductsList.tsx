import { useEffect, useState } from 'react';
import { activateProduct, deactivateProduct, getAllProducts } from '@/api/products';
import type { ProductResponse } from '@/types/product';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { sortByAlpha } from '@/utils/sort';

const ProductsList = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(sortByAlpha(data ?? [], 'name'));
    } catch {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    setActionLoadingId(id);
    try {
      if (currentActive) {
        await deactivateProduct(id);
        toast.success('Produto desativado');
      } else {
        await activateProduct(id);
        toast.success('Produto ativado');
      }
      loadProducts();
    } catch {
      toast.error('Erro ao atualizar status');
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-2 md:px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-blue-900">Produtos</h1>
        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate('/admin/products/create', { state: { backgroundLocation: location } })}
        >
          + Novo Produto
        </Button>
      </div>

      {loading ? (
        <p className="text-blue-900">Carregando...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded-2xl p-4 bg-white shadow flex flex-row justify-between items-center min-h-[90px] h-24"
            >
              <div>
                <div className="text-lg font-medium text-blue-800">{p.name}</div>
                <div className="text-sm text-gray-500 line-clamp-2">
                  R$ {p.price.toFixed(2).replace('.', ',')} • {p.saleType} • {p.productTypeName} • {p.brandName} • Estoque: {p.availableStock} • {p.active ? 'Ativo' : 'Inativo'}
                </div>
              </div>
              <div className="flex flex-row gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  className="min-w-[80px] bg-sky-300 hover:bg-sky-400"
                  onClick={() => navigate(`/admin/products/update/${p.id}`, { state: { backgroundLocation: location } })}
                >
                  Editar
                </Button>
                <Button
                  variant={p.active ? 'destructive' : 'default'}
                  className="min-w-[80px]"
                  onClick={() => handleToggleActive(p.id, p.active)}
                  disabled={actionLoadingId === p.id}
                >
                  {actionLoadingId === p.id
                    ? 'Aguarde...'
                    : p.active ? 'Desativar' : 'Reativar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;