import { useEffect, useState } from 'react';
import { getMyRentals } from '@/api/rentals';
import { getMyPenalties } from '@/api/penalties';
import type { RentalResponse, RentalStatus } from '@/types/rental';
import type { PenaltyResponse } from '@/types/penalty';
import RentalCard from '@/components/RentalCard';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Rentals = () => {
  const [rentals, setRentals] = useState<RentalResponse[]>([]);
  const [penalties, setPenalties] = useState<PenaltyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RentalStatus | 'TODOS'>('TODOS');
  const navigate = useNavigate();
  const filteredRentals = statusFilter === 'TODOS'
  ? rentals
  : rentals.filter((r) => r.status === statusFilter);

    const statusOptions: (RentalStatus | 'TODOS')[] = [
        'TODOS',
        'AGUARDANDO_RETIRADA',
        'EM_USO',
        'ATRASADO',
        'DANIFICADO',
        'DEVOLVIDO',
    ];


  const loadAll = async () => {
    setLoading(true);
    try {
      const [rentalData, penaltyData] = await Promise.all([
        getMyRentals(),
        getMyPenalties(),
      ]);
      setRentals(rentalData);
      setPenalties(penaltyData);
    } catch {
      toast.error('Erro ao carregar aluguéis ou multas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);


  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Aluguéis</h1>
        <Button variant="outline" onClick={() => navigate('/orders')}>
          Voltar aos pedidos
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {statusOptions.map((status) => (
            <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
            >
            {status === 'TODOS' ? 'Todos' : status.replace('_', ' ')}
            </Button>
        ))}
       </div>


      {loading ? (
        <p className="text-gray-500">Carregando aluguéis...</p>
      ) : rentals.length === 0 ? (
        <p className="text-gray-500">Você ainda não possui aluguéis registrados.</p>
      ) : (
        <div className="space-y-4">
          {filteredRentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              penalty={penalties.find((p) => p.rentalId === rental.id) || null}
              onPenaltyPaid={loadAll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rentals;