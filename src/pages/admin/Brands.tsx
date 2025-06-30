import { useEffect, useState } from 'react';
import { getBrands } from '@/api/brands';
import type { Brand } from '@/types/brand';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { sortByAlpha } from '@/utils/sort';

const Brands = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(sortByAlpha(data ?? [], 'name'));
    } catch {
      toast.error('Erro ao carregar marcas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-2 md:px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-blue-900">Marcas</h1>
        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate('/admin/brands/create', { state: { backgroundLocation: location } })}
        >
          + Nova Marca
        </Button>
      </div>

      {loading ? (
        <p className="text-blue-900">Carregando...</p>
      ) : brands.length === 0 ? (
        <p className="text-gray-500">Nenhuma marca cadastrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="border rounded-2xl p-4 bg-white shadow flex flex-row justify-between items-center min-h-[82px] h-20"
            >
              <span className="text-lg font-medium text-blue-800">{brand.name}</span>
              <div className="flex flex-row gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  className="min-w-[80px] bg-sky-300 hover:bg-sky-400"
                  onClick={() => navigate(`/admin/brands/update/${brand.id}`, { state: { backgroundLocation: location } })}
                >
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brands;