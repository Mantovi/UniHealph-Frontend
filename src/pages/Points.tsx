import { useCallback, useEffect, useState } from 'react';
import { getPointsBalance, getPointsHistory } from '@/api/points';
import type { PointsBalance, PointsHistory, PointsType } from '@/types/points';
import { toast } from 'react-toastify';
import PointsCard from '@/components/PointsCard';
import { Button } from '@/components/ui/button';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

const Points = () => {
  const [balance, setBalance] = useState<PointsBalance | null>(null);
  const [history, setHistory] = useState<PointsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PointsType | 'TODOS'>('TODOS');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [balance, history] = await Promise.all([
        getPointsBalance(),
        getPointsHistory(filter !== 'TODOS' ? filter : undefined),
      ]);
      setBalance(balance);
      setHistory(history);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao buscar histórico de pontos';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const filterOptions: (PointsType | 'TODOS')[] = ['TODOS', 'GANHO', 'USADO', 'BONUS', 'ESTORNO'];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Meus Pontos</h1>

      {balance && (
        <div className="bg-gray-100 rounded p-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">Saldo atual:</p>
          <p className="text-lg font-bold text-green-700">{balance.points} pts (R$ {balance.real.toFixed(2).replace('.', ',')})</p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((type) => (
          <Button
            key={type}
            variant={filter === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(type)}
          >
            {type === 'TODOS' ? 'Todos' : type}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando histórico...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500">Nenhum histórico encontrado.</p>
      ) : (
        <div className="space-y-3">
          {history.map((entry, i) => (
            <PointsCard key={i} history={entry} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Points;