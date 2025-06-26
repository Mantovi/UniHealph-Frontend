import { useEffect, useState } from 'react';
import { activateProduct, deactivateProduct, getAllProducts } from '@/api/products';
import type { ProductResponse } from '@/types/product';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const ProductsList = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
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
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={() => navigate('/admin/products/create')}>+ Novo Produto</Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="border rounded p-4 bg-white shadow flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">{p.name}</h2>
                <p className="text-sm text-gray-500">
                  R$ {p.price.toFixed(2).replace('.', ',')} - {p.saleType} - {p.productTypeName} - {p.brandName} - Estoque: {p.availableStock} - {p.active ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/admin/products/update/${p.id}`)}>
                  Editar
                </Button>
                <Button
                  variant={p.active ? "destructive" : "default"}
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