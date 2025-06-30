import { useState, type FunctionComponent } from 'react';
import type { RentalResponse } from '@/types/rental';
import type { PenaltyResponse } from '@/types/penalty';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { payPenalty } from '@/api/penalties';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

interface Props {
  rental: RentalResponse;
  penalty?: PenaltyResponse | null;
  onPenaltyPaid: () => void;
}

const RentalCard: FunctionComponent<Props> = ({ rental, penalty, onPenaltyPaid }) => {
  const [paying, setPaying] = useState(false);

  const formatDate = (date: string | null) =>
    date ? format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '-';

  const handlePay = async () => {
    if (!penalty) return;
    try {
      setPaying(true);
      const response = await payPenalty(penalty.id);
      showApiMessage(response);
      if (response.success) onPenaltyPaid();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao pagar multa';
      toast.error(message);
    } finally {
      setPaying(false);
    }
  };

  const statusColor: Record<string, string> = {
    'EM_USO': 'text-blue-700 bg-blue-50 border-blue-200',
    'AGUARDANDO_RETIRADA': 'text-yellow-700 bg-yellow-50 border-yellow-200',
    'ATRASADO': 'text-red-700 bg-red-50 border-red-200',
    'DANIFICADO': 'text-orange-700 bg-orange-50 border-orange-200',
    'DEVOLVIDO': 'text-green-700 bg-green-50 border-green-200',
  };

  return (
    <Card className="p-4 rounded-xl shadow bg-white space-y-3">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold text-blue-900">{rental.productName}</h3>
          <p className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${statusColor[rental.status] || 'text-gray-700 bg-gray-100 border-gray-300'} mb-1`}>
            {rental.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
          </p>
          <p className="text-sm text-gray-600">Quantidade: {rental.quantity}</p>
          <p className="text-sm text-gray-600">Semestres: {rental.semesterCount}</p>
        </div>

        <div className="mt-2 md:mt-0 text-sm text-gray-600 text-right">
          <p>Retirado em: <strong>{formatDate(rental.rentedAt)}</strong></p>
          <p>Devolver até: <strong>{formatDate(rental.expectedReturn)}</strong></p>
          <p>Devolvido em: <strong>{formatDate(rental.returnedAt)}</strong></p>
        </div>
      </div>

      {penalty && (
        <div className={`border-t pt-3 mt-3 text-sm rounded p-3
            ${penalty.isPaid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
        `}>
          <p>
            <strong>Multa:</strong> R$ {penalty.amount.toFixed(2).replace('.', ',')} - {penalty.reason}
          </p>

          {penalty.isPaid ? (
            <p className="mt-1 text-green-700 font-medium">Multa paga</p>
          ) : (
            <>
              <p className="mt-1 font-medium">Pagamento pendente</p>
              <Button
                onClick={handlePay}
                disabled={paying}
                className="mt-2"
                variant="destructive"
                size="sm"
              >
                {paying ? 'Pagando...' : 'Pagar multa'}
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default RentalCard;