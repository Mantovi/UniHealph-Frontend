import { useEffect, useState } from 'react';
import { getAllProducts } from '@/api/products';
import { updateStockQuantity, updateStockThreshold } from '@/api/stock';
import type { ProductResponse } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const StockManagement = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState<string>('');
  const [editThreshold, setEditThreshold] = useState<string>(''); 

  useEffect(() => {
    loadProducts();
  }, []);

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

  const handleEdit = (id: number, currentQty: number, currentThreshold: number) => {
    setEditId(id);
    setEditQty(String(currentQty));
    setEditThreshold(String(currentThreshold));
  };

  const handleCancel = () => {
    setEditId(null);
    setEditQty('');
    setEditThreshold('');
  };

  const handleSave = async (id: number) => {
    const newQty = Number(editQty);
    const newThreshold = Number(editThreshold);
    if (isNaN(newQty) || newQty < 0) {
      toast.error('Informe uma quantidade válida');
      return;
    }
    if (isNaN(newThreshold) || newThreshold < 0) {
      toast.error('Informe um limite válido');
      return;
    }
    try {
      await updateStockQuantity(id, newQty);
      await updateStockThreshold(id, newThreshold);
      toast.success('Estoque e limite atualizados!');
      handleCancel();
      loadProducts();
    } catch {
      toast.error('Erro ao atualizar dados');
    }
  };

  const filteredProducts = products
    .filter(p => !showOnlyAlerts || p.availableStock <= p.stockThreshold)
    .sort((a, b) => {
      const aAlert = a.availableStock <= a.stockThreshold;
      const bAlert = b.availableStock <= b.stockThreshold;
      if (aAlert !== bAlert) return aAlert ? -1 : 1;
      return a.availableStock - b.availableStock;
    });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Gerenciamento de Estoque</h1>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlyAlerts}
            onChange={() => setShowOnlyAlerts(v => !v)}
            className="accent-red-600"
          />
          <span className="text-sm">Mostrar apenas produtos em alerta</span>
        </label>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-xl bg-white shadow text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Estoque</th>
                <th className="px-4 py-2">Limite</th>
                <th className="px-4 py-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">Nenhum produto encontrado</td>
                </tr>
              )}
              {filteredProducts.map(product => {
                const isAlert = product.availableStock <= product.stockThreshold;
                const isEditing = editId === product.id;
                return (
                  <tr key={product.id} className={isAlert ? 'bg-red-50' : ''}>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.saleType}</td>
                    <td className={`px-4 py-2 font-bold ${isAlert ? 'text-red-600' : ''}`}>
                      {isEditing ? (
                        <Input
                          type="number"
                          min={0}
                          value={editQty}
                          onChange={e => setEditQty(e.target.value)}
                          className="w-20"
                        />
                      ) : (
                        product.availableStock
                      )}
                    </td>
                    <td className={`px-4 py-2 ${isAlert ? 'text-red-600 font-bold' : ''}`}>
                      {isEditing ? (
                        <Input
                          type="number"
                          min={0}
                          value={editThreshold}
                          onChange={e => setEditThreshold(e.target.value)}
                          className="w-20"
                        />
                      ) : (
                        product.stockThreshold
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave(product.id)}>Salvar</Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>Cancelar</Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product.id, product.availableStock, product.stockThreshold)}
                        >
                          Editar
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockManagement;