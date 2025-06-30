import { useEffect, useState } from 'react';
import { getProductTypes, deactivateProductType, activateProductType } from '@/api/productType';
import type { ProductType } from '@/types/productType';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const ProductTypes = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadProductTypes = async () => {
    setLoading(true);
    try {
      const data = await getProductTypes();
      setTypes(data);
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao carregar tipos de produto';
        toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    setActionLoadingId(id);
    try {
      if (currentActive) {
        await deactivateProductType(id);
        toast.success('Tipo de produto desativado');
      } else {
        await activateProductType(id);
        toast.success('Tipo de produto ativado');
      }
      loadProductTypes();
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao ativar/desativar tipo de produto';
        toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadProductTypes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Tipos de Produto</h1>
        <Button onClick={() => navigate('/admin/product-types/create', { state: { backgroundLocation: location } })}>
          + Novo Tipo
        </Button>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {types.map((t) => (
            <div key={t.id}
              className="border rounded-xl p-6 bg-white shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[110px] transition-all"
            >
              <div>
                <h2 className="text-lg font-medium">{t.name}</h2>
                <p className="text-sm text-gray-500">
                  Status: <span className={t.active ? "text-green-700" : "text-red-600"}>{t.active ? 'Ativo' : 'Inativo'}</span>
                  {" "}• Produtos: {t.products?.length || 0}
                </p>
              </div>
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto"
                  onClick={() => navigate(`/admin/product-types/update/${t.id}`, { state: { backgroundLocation: location } })}>
                  Editar
                </Button>
                <Button
                  variant={t.active ? "destructive" : "default"}
                  className="w-full sm:w-auto"
                  onClick={() => handleToggleActive(t.id, t.active)}
                  disabled={actionLoadingId === t.id}
                >
                  {actionLoadingId === t.id
                    ? 'Aguarde...'
                    : t.active ? 'Desativar' : 'Reativar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTypes;