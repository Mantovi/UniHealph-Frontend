import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Search, ShoppingCart, UserCircle, LayoutGrid, Tag, Info, Mail } from 'lucide-react';
import Logo from '@/assets/Logo.png';

const NAV_LINKS = [
  { to: '/products', label: 'Produtos' },
  { to: '/categories', label: 'Categorias' },
  { to: '/about', label: 'Sobre Nós' },
  { to: '/contact', label: 'Contato' },
];

const Header = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    setSearch(currentQ);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
    } else {
      navigate('/products');
    }
  };

  if (!user) return null;

  return (
    <>
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-2 md:px-4 py-2 md:py-3">
          <Link to="/" className="flex items-center gap-2" aria-label="Página inicial">
            <img
              src={Logo}
              alt="Logo Uni-Healph"
              className="object-contain"
              style={{
                height: window.innerWidth < 768 ? 32 : 40, 
                width: 'auto',
                minWidth: window.innerWidth < 768 ? 32 : 40,
              }}
            />
          </Link>

          <nav className="hidden md:flex gap-4 text-sm font-medium text-gray-700 ml-4">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`hover:underline ${location.pathname === to ? 'text-sky-700 font-bold' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <form
            onSubmit={handleSearch}
            className={`flex-1 mx-2 flex
            ${window.innerWidth < 768 ? 'max-w-full' : 'max-w-xl'}
            `}
          >
            <Input
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-r-none"
              style={{
                minWidth: window.innerWidth < 768 ? 0 : 180,
                width: window.innerWidth < 768 ? '100%' : undefined,
              }}
            />
            <Button type="submit" className="rounded-l-none px-3">
              <Search size={18} />
            </Button>
          </form>

          <div className="flex items-center gap-2 ml-2">
            <Link to="/cart" title="Carrinho">
              <ShoppingCart className="text-gray-600 hover:text-sky-600" size={26} />
            </Link>
            <Link to="/profile" title="Perfil" className="hidden md:inline-flex">
              <UserCircle className="text-gray-600 hover:text-sky-600" size={26} />
            </Link>
          </div>
        </div>
      </header>

      <nav
        className="fixed bottom-0 left-0 w-full bg-white shadow-lg flex md:hidden z-40 border-t"
        role="navigation"
      >
        {NAV_LINKS.map(({ to, label }, idx) => {
          const Icon =
            [LayoutGrid, Tag, Info, Mail, UserCircle][idx] || LayoutGrid;
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 text-xs transition
                ${location.pathname === to ? 'text-sky-600 font-bold' : 'text-gray-700'}
                hover:bg-sky-50`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Header;