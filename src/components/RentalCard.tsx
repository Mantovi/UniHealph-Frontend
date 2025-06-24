import { type FunctionComponent, useState } from 'react';
import type { RentalResponse } from '@/types/rental';
import type { PenaltyResponse } from '@/types/penalty';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { payPenalty } from '@/api/penalties';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
      await payPenalty(penalty.id);
      toast.success('Multa paga com sucesso');
      onPenaltyPaid();
    } catch {
      toast.error('Erro ao pagar multa');
    } finally {
      setPaying(false);
    }
  };

  return (
    <Card className="p-4 rounded-xl shadow bg-white space-y-3">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h3 className="text-lg font-semibold">{rental.productName}</h3>
          <p className="text-sm text-gray-600">Status: {rental.status}</p>
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
