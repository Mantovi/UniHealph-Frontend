import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const Admin = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();

  const sections = [
    { label: 'Ver requisições', path: '/admin/see-requests' },
    { label: 'Ver alugueis', path: '/admin/rentals' },
    { label: 'Planos', path: '/admin/plans' },
    { label: 'Formas de Pagamento', path: '/admin/payment-methods' },
    { label: 'Marcas', path: '/admin/brands' },
    { label: 'Especialidades', path: '/admin/specialties' },
    { label: 'Subespecialidades', path: '/admin/sub-specialties' },
    { label: 'Categorias', path: '/admin/categories' },
    { label: 'Tipos de Produto', path: '/admin/product-types' },
    { label: 'Hierarquia de Categorias', path: '/admin/category-hierarchy' },
    { label: 'Produtos', path: '/admin/products' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Painel Administrativo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Button
            key={section.path}
            className="w-full"
            onClick={() => navigate(section.path)}
            variant="secondary"
          >
            {section.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Admin;