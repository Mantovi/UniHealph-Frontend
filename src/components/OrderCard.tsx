import type { FunctionComponent } from 'react';
import type { OrderResponse } from '@/types/order';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  order: OrderResponse;
}

const OrderCard: FunctionComponent<Props> = ({ order }) => {
  const formatDate = (date: string) =>
    format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  const formatCurrency = (value: number) =>
    `R$ ${value.toFixed(2).replace('.', ',')}`;

  return (
    <Card className="p-4 space-y-4 border bg-white shadow-md rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="font-semibold text-lg">Pedido #{order.orderId}</h2>
          <p className="text-sm text-gray-600">
            Realizado em: {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-sm px-3 py-1 rounded-full font-medium bg-gray-100 border">
          Status: {order.orderStatus}
        </div>
      </div>

      <div className="border-t pt-4 space-y-4">
        {order.items.map((item, index) => (
          <div key={index} className="border-b pb-3 last:border-none">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="font-medium text-gray-800">{item.productName}</p>
                <p className="text-sm text-gray-600">
                  Tipo: {item.salesType === 'ALUGUEL' ? 'Aluguel' : 'Venda'}
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
                <p className="text-sm text-gray-500">Total:</p>
                <p className="font-bold text-green-700">
                  {formatCurrency(item.totalPrice)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-700 border-t pt-4 gap-2">
        <div>
          <p><strong>Pontos usados:</strong> {order.pointsUsed}</p>
          <p><strong>Pontos ganhos:</strong> {order.pointsEarned}</p>
        </div>
        <div className="font-semibold text-base">
          Valor final: {formatCurrency(order.finalPrice)}
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
