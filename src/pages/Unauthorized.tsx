import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-blue-100 p-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-4xl text-orange-500">
            <ArrowLeftCircle size={36} />
          </span>
          <span className="text-2xl font-bold text-orange-600">
            Acesso não autorizado
          </span>
        </div>
        <p className="text-base text-gray-700 text-center">
          Você não tem permissão para acessar esta página.
        </p>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold"
          onClick={() => navigate('/login')}
        >
          Voltar para login
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;