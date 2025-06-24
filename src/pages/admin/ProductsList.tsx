import { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '@/api/products';
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
  const navigate = useNavigate();

  const load = async () => {
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

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este produto?')) return;
    try {
      await deleteProduct(id);
      toast.success('Produto excluído');
      load();
    } catch {
      toast.error('Erro ao excluir produto');
    }
  };

  useEffect(() => {
    load();
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
                <Button variant="destructive" onClick={() => handleDelete(p.id)}>
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

export default ProductsList;