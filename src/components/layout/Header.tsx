import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Search, ShoppingCart, UserCircle } from 'lucide-react';

const Header = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-primary">
            Uni-Healph
          </Link>

          <nav className="hidden md:flex gap-4 text-sm font-medium text-gray-700">
            <Link to="/products" className="hover:underline">Produtos</Link>
            <Link to="/categories" className="hover:underline">Categorias</Link>
            <Link to="/about" className="hover:underline">Sobre Nós</Link>
            <Link to="/contact" className="hover:underline">Contato</Link>
          </nav>
        </div>

        <form onSubmit={handleSearch} className="flex-1 mx-6 max-w-lg hidden md:flex">
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-r-none"
          />
          <Button type="submit" className="rounded-l-none px-3">
            <Search size={16} />
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <Link to="/cart" title="Carrinho">
            <ShoppingCart className="text-gray-600 hover:text-primary" size={22} />
          </Link>
          <Link to="/profile" title="Perfil">
            <UserCircle className="text-gray-600 hover:text-primary" size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;