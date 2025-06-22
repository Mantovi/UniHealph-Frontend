import { useEffect, useState } from 'react';
import { getOrders } from '@/api/orders';
import type { OrderResponse } from '@/types/order';
import { toast } from 'react-toastify';
import OrderCard from '@/components/OrderCard';
import { Loader2 } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch {
        toast.error('Erro ao carregar seus pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
        Meus Pedidos
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-16 text-gray-500">
          <Loader2 className="animate-spin mr-2" />
          Carregando pedidos...
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">
          Você ainda não realizou nenhum pedido.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
