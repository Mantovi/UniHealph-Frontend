import { useEffect, useState } from 'react';
import { getBrands, deleteBrand } from '@/api/brands';
import type { Brand } from '@/types/brand';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const Brands = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(data);
    } catch {
      toast.error('Erro ao carregar marcas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta marca?')) return;
    try {
      await deleteBrand(id);
      toast.success('Marca excluída');
      loadBrands();
    } catch {
      toast.error('Erro ao excluir marca');
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <Button onClick={() => navigate('/admin/brands/create')}>+ Nova Marca</Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {brands.map((brand) => (
            <div key={brand.id} className="border rounded p-4 bg-white shadow flex justify-between items-center">
              <span className="text-lg font-medium">{brand.name}</span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/admin/brands/update/${brand.id}`)}>
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(brand.id)}>
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

export default Brands;