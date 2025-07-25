import { useEffect, useState } from 'react';
import { getMyRentals } from '@/api/rentals';
import { getMyPenalties } from '@/api/penalties';
import type { RentalResponse, RentalStatus } from '@/types/rental';
import type { PenaltyResponse } from '@/types/penalty';
import RentalCard from '@/components/RentalCard';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import { sortByDateDesc } from '@/utils/sort';

const StudentRentals = () => {
  const [rentals, setRentals] = useState<RentalResponse[]>([]);
  const [penalties, setPenalties] = useState<PenaltyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RentalStatus | 'TODOS'>('TODOS');
  const navigate = useNavigate();

  const statusOptions: (RentalStatus | 'TODOS')[] = [
    'TODOS',
    'AGUARDANDO_RETIRADA',
    'EM_USO',
    'ATRASADO',
    'DANIFICADO',
    'DEVOLVIDO',
  ];

  const filteredRentals = statusFilter === 'TODOS'
    ? rentals
    : rentals.filter((r) => r.status === statusFilter);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [rentalData, penaltyData] = await Promise.all([
        getMyRentals(),
        getMyPenalties(),
      ]);
      setRentals(sortByDateDesc(rentalData, 'expectedReturn'));
      setPenalties(penaltyData);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || axiosError.message || 'Erro ao carregar aluguéis';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 md:px-4 space-y-6 bg-blue-50 rounded-4xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="text-2xl font-bold text-blue-900">Meus Aluguéis</h1>
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
            {status === 'TODOS'
              ? 'Todos'
              : status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
            }
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Carregando aluguéis...</p>
      ) : rentals.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Você ainda não possui aluguéis registrados.</p>
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

export default StudentRentals;