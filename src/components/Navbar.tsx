import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const isAdmin = user?.role === 'ADMIN';
  const isUniversity = user?.role === 'UNIVERSITY';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-blue-700">
          Uni+Healph
        </Link>
        

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/products" className="hover:text-blue-600">Produtos</Link>
          <Link to="/about-us" className="hover:text-blue-600">Sobre</Link>
          <Link to="/contact" className="hover:text-blue-600">Contato</Link>
          <Link to="/feedback" className="hover:text-blue-600">Feedback</Link>
          {isUniversity && <Link to="/university/add-permitted-students" className="text-blue-600 font-semibold">Add Students</Link>}
          {isAdmin && <Link to="/admin/add-university" className="text-blue-600 font-semibold">Add University</Link>}
        </div>

        {/* Search + Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Input placeholder="Pesquisar..." className="max-w-sm" />
          <Link to="/profile">👤</Link>
          <Link to="/cart">🛒</Link>
          {user && <button onClick={logout} className="text-red-500 text-sm">Sair</button>}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden">
          {menuOpen ? <Menu /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 flex flex-col space-y-0 text-sm">
      <Link to="/" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100">Home</Link>
      <Link to="/products" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100">Produtos</Link>
      <Link to="/about-us" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100">Sobre</Link>
      <Link to="/contact" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100">Contato</Link>
      <Link to="/feedback" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100">Feedback</Link>
      {isUniversity && <Link to="/university/add-permitted-students" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100">Add Students</Link>}
      {isAdmin && <Link to="/admin/add-university" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100">Add University</Link>}
      <Link to="/profile" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100">Perfil</Link>
      <Link to="/cart" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100">Carrinho</Link>
      {user && <button onClick={() => { logout(); toggleMenu();}} className="px-4 py-2 text-red-500 hover:bg-gray-100 text-left">Sair</button>}
    </div>
      )}
    </nav>
  );
};

export default Navbar;
