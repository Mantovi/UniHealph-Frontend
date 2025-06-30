import { useEffect, useState } from 'react';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import {
  approveRequest,
  getAllUniversityRequests,
  rejectRequest,
} from '@/api/universityRequest';
import type { PendingUniversityRequestResponse } from '@/types/university-request';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import type { Role } from '@/types/user';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import { sortByDateDesc } from '@/utils/sort';

const AdminUniversityRequest = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const [requests, setRequests] = useState<PendingUniversityRequestResponse[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getAllUniversityRequests();
      setRequests(sortByDateDesc(data ?? [], 'requestedAt'));
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar requisições');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setLoadingId(id);
      const response = await approveRequest(id);
      showApiMessage(response);
      if (response.success) {
        await loadRequests();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || axiosError.message || 'Erro ao aprovar solicitação';
      toast.error(message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setLoadingId(id);
      const response = await rejectRequest(id);
      showApiMessage(response);
      if (response.success) {
        await loadRequests();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || axiosError.message || 'Erro ao recusar solicitação';
      toast.error(message);
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">Aprovada</span>;
      case 'RECUSADA':
        return <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">Recusada</span>;
      default:
        return <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">Aguardando</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 mt-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Requisições de Universidades</h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma solicitação encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="p-4 border rounded-2xl shadow-sm bg-white">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                <div>
                  <p className="text-lg font-bold">{req.name}</p>
                  <p className="text-sm text-gray-500">{req.email} • CNPJ: {req.cnpj}</p>
                  <p className="text-sm text-gray-500">
                    Gestor: {req.managerName} ({req.managerEmail})
                  </p>
                  <p className="text-sm text-gray-500">
                    Plano: {req.planName} • Pagamento: {req.paymentType}
                  </p>
                  <p className="text-sm text-gray-500">
                    Solicitado em: {formatDate(req.requestedAt)}
                  </p>
                  <div className="mt-1">{statusBadge(req.status)}</div>
                </div>

                {req.status === 'AGUARDANDO' && (
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button
                      variant="default"
                      onClick={() => handleApprove(req.id)}
                      disabled={loadingId === req.id}
                    >
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(req.id)}
                      disabled={loadingId === req.id}
                    >
                      Recusar
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminUniversityRequest;