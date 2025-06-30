import { useAuthStore } from '@/store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const sidebarLinks = [
  { path: '/orders', label: 'Pedidos' },
  { path: '/points', label: 'Pontos' },
  { path: '/rentals', label: 'Aluguéis' },
];

const Sidebar = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const links = [...sidebarLinks];
  if (user.role === 'UNIVERSITY') {
    links.push({ path: '/permitted-students', label: 'Estudantes Permitidos' });
  }
  if (user.role === 'ADMIN') {
    links.push({ path: '/admin', label: 'Painel Admin' });
  }

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      <aside className="hidden md:flex flex-colbg-white shadow-lg rounded-2xl h-[90vh] mt-7 ml-4 w-56 p-4 sticky top-[90px]">
        <nav className="flex flex-col gap-2">
          {links.map(link => (
            <button
              key={link.path}
              className={`text-left w-full px-4 py-2 rounded-2xl font-medium transition
                ${isActive(link.path) 
                  ? 'bg-sky-50 text-sky-700 font-bold'
                  : 'text-blue-900 hover:bg-sky-100 hover:text-sky-700'}
                focus:outline-none`}
              onClick={() => navigate(link.path)}
              tabIndex={0}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="md:hidden fixed left-3 top-[120px] z-40">
        <button
          className="bg-white rounded-full shadow-lg p-2 border border-gray-200"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
        >
          <Menu size={28} className="text-blue-900" />
        </button>
      </div>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        >
          <nav
            className="fixed top-[56px] left-0 bg-white w-64 h-[calc(100vh-56px)] p-6 shadow-2xl z-50 flex flex-col gap-4 rounded-tr-3xl rounded-br-3xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="self-end mb-4 text-blue-900 font-bold text-2xl p-2 hover:text-sky-700 transition"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={28} />
            </button>
            {links.map(link => (
              <button
                key={link.path}
                className={`text-left w-full px-4 py-3 rounded-xl text-base font-medium transition
                  ${isActive(link.path) 
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-blue-900 hover:bg-sky-100 hover:text-sky-700'}
                  focus:outline-none`}
                onClick={() => {
                  setOpen(false);
                  navigate(link.path);
                }}
                tabIndex={0}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;