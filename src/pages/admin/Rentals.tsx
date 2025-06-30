import { useEffect, useState } from 'react';
import { getRentalsByStatus, updateRentalStatus } from '@/api/rentals';
import type { RentalResponse, RentalStatus } from '@/types/rental';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const statusOptions: { label: string, value: RentalStatus }[] = [
  { label: 'Aguardando Retirada', value: 'AGUARDANDO_RETIRADA' },
  { label: 'Em Uso', value: 'EM_USO' },
  { label: 'Devolvido', value: 'DEVOLVIDO' },
  { label: 'Atrasado', value: 'ATRASADO' },
  { label: 'Danificado', value: 'DANIFICADO' },
];

const Rentals = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [status, setStatus] = useState<RentalStatus>('AGUARDANDO_RETIRADA');
  const [rentals, setRentals] = useState<RentalResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRentals = async (selectedStatus: RentalStatus) => {
    setLoading(true);
    try {
      const data = await getRentalsByStatus(selectedStatus);
      setRentals(data);
    } catch {
      toast.error('Erro ao carregar aluguéis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRentals(status);
  }, [status]);

  const handleUpdateStatus = async (id: number, newStatus: RentalStatus) => {
    try {
      const response = await updateRentalStatus(id, newStatus);
      showApiMessage(response);
      if (response.success) {
        loadRentals(status);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao atualizar status do aluguel';
      toast.error(message);
    }
  };

  const statusColor = (s: RentalStatus) => {
    switch (s) {
      case 'AGUARDANDO_RETIRADA': return 'text-yellow-600 font-bold';
      case 'EM_USO': return 'text-blue-700 font-bold';
      case 'DEVOLVIDO': return 'text-green-700 font-bold';
      case 'ATRASADO': return 'text-red-600 font-bold';
      case 'DANIFICADO': return 'text-red-900 font-bold';
      default: return '';
    }
  };

  const statusLabel = (s: RentalStatus) => {
    switch (s) {
      case 'AGUARDANDO_RETIRADA': return 'Aguardando Retirada';
      case 'EM_USO': return 'Em Uso';
      case 'DEVOLVIDO': return 'Devolvido';
      case 'ATRASADO': return 'Atrasado';
      case 'DANIFICADO': return 'Danificado';
      default: return s;
    }
  };

  const formatDate = (dateStr?: string | null) =>
    dateStr ? new Date(dateStr).toLocaleString('pt-BR') : '--';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
        Gestão de Aluguéis
      </h1>

      <div className="mb-6 flex flex-wrap gap-2 justify-center md:justify-start">
        {statusOptions.map(opt => (
          <Button
            key={opt.value}
            variant={status === opt.value ? 'default' : 'outline'}
            onClick={() => setStatus(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <p>Carregando aluguéis...</p>
      ) : rentals.length === 0 ? (
        <p>Nenhum aluguel encontrado neste status.</p>
      ) : (
        <div className="space-y-4">
          {rentals.map(rental => (
            <div
              key={rental.id}
              className="border p-4 rounded-xl bg-white shadow flex flex-col md:flex-row justify-between items-center gap-4 transition-all"
            >
              <div className="flex-1 space-y-2 w-full">
                <div className="font-bold text-lg">{rental.productName}</div>
                <div className="text-sm text-gray-700">
                  Quantidade: {rental.quantity} | Semestres: {rental.semesterCount}
                </div>
                <div>
                  Status:{' '}
                  <span className={statusColor(rental.status)}>
                    {statusLabel(rental.status)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Retirado em: <span className="font-medium">{formatDate(rental.rentedAt)}</span>
                  <br />
                  Devolução prevista: <span className="font-medium">{formatDate(rental.expectedReturn)}</span>
                  {rental.returnedAt && (
                    <>
                      <br />
                      Devolvido em: <span className="font-medium">{formatDate(rental.returnedAt)}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-2 min-w-[180px]">
                {rental.status === 'AGUARDANDO_RETIRADA' && (
                  <Button
                    aria-label="Marcar como Em Uso"
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white transition"
                    onClick={() => handleUpdateStatus(rental.id, 'EM_USO')}
                  >
                    Marcar como Em Uso
                  </Button>
                )}

                {rental.status === 'EM_USO' && (
                  <>
                    <Button
                      aria-label="Marcar como Devolvido"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 text-white transition"
                      onClick={() => handleUpdateStatus(rental.id, 'DEVOLVIDO')}
                    >
                      Marcar como Devolvido
                    </Button>
                    <Button
                      aria-label="Marcar como Danificado"
                      variant="destructive"
                      onClick={() => handleUpdateStatus(rental.id, 'DANIFICADO')}
                    >
                      Marcar como Danificado
                    </Button>
                    <Button
                      aria-label="Marcar como Atrasado"
                      variant="destructive"
                      onClick={() => handleUpdateStatus(rental.id, 'ATRASADO')}
                    >
                      Marcar como Atrasado
                    </Button>
                  </>
                )}

                {rental.status === 'ATRASADO' && (
                  <Button
                    aria-label="Marcar como Devolvido"
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white transition"
                    onClick={() => handleUpdateStatus(rental.id, 'DEVOLVIDO')}
                  >
                    Marcar como Devolvido
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rentals;