import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaShoppingCart, FaUser } from 'react-icons/fa'; 
import Logo from '../assets/Logo.png';

const Header = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex">
        <img src={Logo} alt="Logo Uni+Healph" className="w-47 h-11" />
      </Link>

      <nav className="flex gap-6 items-center text-gray-700 font-medium">
        <Link to="/products" className="hover:text-blue-600 transition">Produtos</Link>
        <Link to="/specialties" className="hover:text-blue-600 transition">Categorias</Link>
        <Link to="/about" className="hover:text-blue-600 transition">Sobre nós</Link>
        <Link to="/contact" className="hover:text-blue-600 transition">Contate-nos</Link>
      </nav>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </form>

        <Link to="/cart" className="text-gray-700 hover:text-blue-600 text-lg">
          <FaShoppingCart />
        </Link>

        <Link to="/profile" className="text-gray-700 hover:text-blue-600 text-lg">
          <FaUser />
        </Link>
      </div>
    </header>
  );
};

export default Header;
