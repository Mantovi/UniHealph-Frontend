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
      setRequests(data ?? []);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return 'text-green-600 font-semibold';
      case 'RECUSADA':
        return 'text-red-600 font-semibold';
      default:
        return 'text-yellow-600 font-semibold';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">Requisições de Universidades</h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma solicitação encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="p-4 border rounded-lg shadow bg-white">
              <div className="flex justify-between items-center mb-2">
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
                  <p className={statusColor(req.status)}>Status: {req.status}</p>
                </div>

                {req.status === 'AGUARDANDO' && (
                  <div className="flex flex-col gap-2">
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