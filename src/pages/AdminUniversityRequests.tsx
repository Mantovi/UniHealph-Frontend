import { useEffect, useState } from 'react';
import { getUniversityRequests, approveUniversityRequest, rejectUniversityRequest } from '../api/adminUniversityApi';
import { PendingUniversityResponse } from '../types/university';

const AdminUniversityRequests = () => {
  const [requests, setRequests] = useState<PendingUniversityResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getUniversityRequests();
        setRequests(data);
      } catch (error) {
        setError('Erro ao carregar as solicitações');
        console.error(error);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approveUniversityRequest(id);
      setRequests(requests.filter((request) => request.id !== id));
    } catch (error) {
      setError('Erro ao aprovar a solicitação');
      console.error(error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectUniversityRequest(id);
      setRequests(requests.filter((request) => request.id !== id));
    } catch (error) {
      setError('Erro ao rejeitar a solicitação');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Solicitações de Universidades</h2>

      {error && <div className="text-red-500">{error}</div>}

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Nome da Universidade</th>
            <th className="px-4 py-2">CNPJ</th>
            <th className="px-4 py-2">Gestor</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="border px-4 py-2">{request.name}</td>
              <td className="border px-4 py-2">{request.cnpj}</td>
              <td className="border px-4 py-2">{request.managerName}</td>
              <td className="border px-4 py-2">{request.status}</td>
              <td className="border px-4 py-2">
                {request.status === 'AGUARDANDO' && (
                  <>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Rejeitar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUniversityRequests;
