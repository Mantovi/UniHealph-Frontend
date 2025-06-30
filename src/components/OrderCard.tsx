import type { FunctionComponent } from 'react';
import type { OrderResponse } from '@/types/order';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  order: OrderResponse;
}

const formatDate = (date: string) =>
  format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

const statusColor = (status: string) => {
  switch (status) {
    case 'CONCLUIDO':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    case 'CANCELADO':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'PENDENTE':
      return 'bg-orange-100 text-orange-700 border-orange-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const OrderCard: FunctionComponent<Props> = ({ order }) => {
  return (
    <Card className="p-4 space-y-4 border bg-white shadow-md rounded-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="font-semibold text-lg text-blue-900">Pedido #{order.orderId}</h2>
          <p className="text-sm text-gray-600">
            Realizado em: {formatDate(order.createdAt)}
          </p>
        </div>
        <div
          className={`text-sm px-3 py-1 rounded-full font-medium border ${statusColor(order.orderStatus)}`}
        >
          Status: {order.orderStatus}
        </div>
      </div>

      <div className="border-t pt-4 space-y-4">
        {order.items.map((item, index) => (
          <div key={index} className="border-b pb-3 last:border-none">
            <div className="flex flex-col md:flex-row justify-between gap-2">
              <div>
                <p className="font-medium text-gray-800">{item.productName}</p>
                <p className="text-sm text-gray-600">
                  Tipo: <span className="font-medium">{item.salesType === 'ALUGUEL' ? 'Aluguel' : 'Venda'}</span>
                </p>
                <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                {item.salesType === 'ALUGUEL' && (
                  <>
                    {item.semesterCount !== null && (
                      <p className="text-sm text-gray-600">
                        Semestres: {item.semesterCount}
                      </p>
                    )}
                    {item.expectedReturn && (
                      <p className="text-sm text-gray-600">
                        Devolução prevista: {formatDate(item.expectedReturn)}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Status do aluguel: {item.state}
                    </p>
                  </>
                )}
              </div>
              <div className="text-right mt-2 md:mt-0">
                <p className="text-xs text-gray-500">Total do item:</p>
                <p className="font-bold text-green-700 text-lg">
                  {formatCurrency(item.totalPrice)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-700 border-t pt-4 gap-2">
        <div>
          <p><strong>Pontos usados:</strong> <span className="text-orange-600">{order.pointsUsed}</span></p>
          <p><strong>Pontos ganhos:</strong> <span className="text-emerald-700">{order.pointsEarned}</span></p>
        </div>
        <div className="font-semibold text-base text-blue-900">
          Valor final: <span className="text-green-700">{formatCurrency(order.finalPrice)}</span>
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;