import { useEffect, useState } from 'react';
import { getRentalsByStatus, updateRentalStatus } from '@/api/rentals';
import type { RentalResponse, RentalStatus } from '@/types/rental';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

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
      await updateRentalStatus(id, newStatus);
      toast.success('Status atualizado');
      loadRentals(status);
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const statusColor = (s: RentalStatus) => {
    switch (s) {
      case 'AGUARDANDO_RETIRADA': return 'text-yellow-600';
      case 'EM_USO': return 'text-blue-600';
      case 'DEVOLVIDO': return 'text-green-600';
      case 'ATRASADO': return 'text-red-600';
      case 'DANIFICADO': return 'text-red-800';
      default: return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Gestão de Aluguéis</h1>

      <div className="mb-6 flex flex-wrap gap-2">
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
            <div key={rental.id} className="border p-4 rounded bg-white shadow flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="flex-1 space-y-1">
                <div className="font-bold">{rental.productName}</div>
                <div>Quantidade: {rental.quantity} | Semestres: {rental.semesterCount}</div>
                <div>Status: <span className={statusColor(rental.status)}>{rental.status.replace('_', ' ')}</span></div>
                <div>
                  Retirado em: {rental.rentedAt ? new Date(rental.rentedAt).toLocaleString('pt-BR') : '--'}<br />
                  Devolução prevista: {rental.expectedReturn ? new Date(rental.expectedReturn).toLocaleString('pt-BR') : '--'}
                </div>
                {rental.returnedAt && (
                  <div>Devolvido em: {new Date(rental.returnedAt).toLocaleString('pt-BR')}</div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {rental.status === 'AGUARDANDO_RETIRADA' && (
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleUpdateStatus(rental.id, 'EM_USO')}
                  >
                    Marcar como Em Uso
                  </Button>
                )}

                {rental.status === 'EM_USO' && (
                  <>
                    <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus(rental.id, 'DEVOLVIDO')}>
                      Marcar como Devolvido
                    </Button>
                    <Button variant="destructive" onClick={() => handleUpdateStatus(rental.id, 'DANIFICADO')}>
                      Marcar como Danificado
                    </Button>
                    <Button variant="destructive" onClick={() => handleUpdateStatus(rental.id, 'ATRASADO')}>
                      Marcar como Atrasado
                    </Button>
                  </>
                )}

                {rental.status === 'ATRASADO' && (
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
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
