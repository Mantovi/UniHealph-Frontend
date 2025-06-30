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
    { label: 'Gerenciar Estoque', path: '/admin/stock' },
  ];

  return (
    <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto py-8 px-2 space-y-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-6 text-center md:text-left">
        Painel Administrativo
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Button
            key={section.path}
            className="
              w-full
              text-base
              font-semibold
              py-4
              rounded-xl
              bg-blue-50
              border
              border-blue-100
              hover:bg-blue-100
              transition-colors
              focus:ring-2
              focus:ring-blue-400
              shadow-sm
            "
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