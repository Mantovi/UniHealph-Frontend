import type { FunctionComponent } from 'react';
import type { PointsHistory } from '@/types/points';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  history: PointsHistory;
}

const PointsCard: FunctionComponent<Props> = ({ history }) => {
  const isPositive = history.type === 'GANHO' || history.type === 'ESTORNO' || history.type === 'BONUS';

  const formatDate = (date: string) =>
    format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  const amountFormatted = `${isPositive ? '+' : '-'}${history.amount}`;

  return (
    <Card className="p-4 border bg-white rounded-xl shadow-sm flex flex-col gap-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-base font-semibold text-blue-900">{history.description}</span>
        <span className={`text-base font-bold ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
          {amountFormatted} pts
        </span>
      </div>
      <span className="text-xs text-gray-500">
        {formatDate(history.createdAt)}
      </span>
    </Card>
  );
};

export default PointsCard;