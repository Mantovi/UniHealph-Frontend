import {
  getCartItems,
  updateCartItem,
  removeCartItem,
} from '@/api/cart';
import { getPointsBalance } from '@/api/points';
import { checkoutCart } from '@/api/orders';
import { useEffect, useState } from 'react';
import type { CartItemResponse } from '@/types/cart';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import CheckoutModal from '@/components/CheckoutModal';
import { getPaymentMethods } from '@/api/payment';
import type { PaymentMethod } from '@/types/payment';
import type { ProductResponse } from '@/types/product';

const Cart = () => {
  const [items, setItems] = useState<CartItemResponse[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [points, setPoints] = useState(0);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [product] = useState<ProductResponse | null>(null);
  

  useEffect(() => {
    if (modalOpen) {
      getPaymentMethods()
        .then(setPaymentMethods)
        .catch(() => toast.error('Erro ao carregar métodos de pagamento'));
    }
  }, [modalOpen]);

  const fetchCart = async () => {
    try {
      const [cartItems, pointBalance] = await Promise.all([
        getCartItems(),
        getPointsBalance(),
      ]);

      setItems(cartItems);
      setSelected(prevSelected =>
        cartItems
          .filter(i => prevSelected.includes(i.productId) && i.isActive)
          .map(i => i.productId)
      );
      setPoints(pointBalance.points);
    } catch {
      toast.error('Erro ao carregar carrinho');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const total = items
      .filter(i => selected.includes(i.productId))
      .reduce((sum, i) => sum + i.totalPrice, 0);
    setGrossTotal(total);
    setFinalTotal(total - Math.min(pointsUsed, total));
  }, [items, selected, pointsUsed]);

  const toggleSelect = (id: number) => {
    const product = items.find(i => i.productId === id);
    if (!product || !product.isActive) return;
    setSelected(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const updateItem = async (
    productId: number,
    quantity: number,
    semesterCount?: number
  ) => {
    try {
      await updateCartItem({ productId, quantity, semesterCount });
      fetchCart();
    } catch {
      toast.error('Erro ao atualizar item');
    }
  };

  const removeItem = async (productId: number) => {
    try {
      await removeCartItem(productId);
      fetchCart();
    } catch {
      toast.error('Erro ao remover item');
    }
  };

  const calculateDiscount = () => {
    if (pointsUsed > points) {
      toast.error('Você não possui pontos suficientes');
      return;
    }
    setFinalTotal(grossTotal - Math.min(pointsUsed, grossTotal));
  };

  const handleCheckout = () => {
    if (selected.length === 0) {
      toast.warn('Selecione ao menos um item válido para comprar.');
      return;
    }
    setModalOpen(true);
  };

const confirmPurchase = async () => {
  try {
    await checkoutCart(selected, pointsUsed);
    toast.success('Compra finalizada com sucesso');
    setModalOpen(false);
    setItems(prev => prev.filter(item => !selected.includes(item.productId)));
    setSelected([]);
    await fetchCart();
  } catch {
    toast.error('Erro ao finalizar compra');
  }
};

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">Meu Carrinho</h1>

        {items.length === 0 ? (
          <p className="text-gray-600">Seu carrinho está vazio.</p>
        ) : (
          items.map((item) => {
            const image =
              item.imageUrl ??
              'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019';

            const isDisabled = !item.isActive;

            return (
              <div
                key={item.productId}
                className={`border p-4 rounded shadow flex flex-col md:flex-row gap-4 items-start ${
                  isDisabled ? 'bg-red-50' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item.productId)}
                  onChange={() => toggleSelect(item.productId)}
                  className="mt-2"
                  disabled={isDisabled}
                />

                <img src={image} alt={item.name} className="w-24 h-24 object-cover rounded" />

                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-sm text-gray-600">
                    Tipo: {item.saleType === 'VENDA' ? 'Venda' : 'Aluguel'}
                  </p>
                  <p className="text-sm">
                    Preço unitário: R$ {item.unitPrice.toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm">
                    Total: R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                  </p>

                  {isDisabled && (
                    <p className="text-red-600 font-semibold mt-1">
                      Produto desativado - não pode ser comprado
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <span>Qtd:</span>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateItem(item.productId, item.quantity - 1, item.semesterCount || undefined)
                        }
                        disabled={item.quantity <= 1 || isDisabled}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateItem(item.productId, item.quantity + 1, item.semesterCount || undefined)
                        }
                        disabled={isDisabled}
                      >
                        +
                      </Button>
                    </div>

                    {item.saleType === 'ALUGUEL' && (
                      <div className="flex items-center gap-2">
                        <span>Semestres:</span>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateItem(item.productId, item.quantity, (item.semesterCount || 1) - 1)
                          }
                          disabled={!item.semesterCount || item.semesterCount <= 1 || isDisabled}
                        >
                          -
                        </Button>
                        <span>{item.semesterCount ?? 1}</span>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateItem(item.productId, item.quantity, (item.semesterCount || 1) + 1)
                          }
                          disabled={isDisabled}
                        >
                          +
                        </Button>
                      </div>
                    )}

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="space-y-4 border rounded p-4 shadow bg-white">
        <h2 className="text-xl font-semibold">Resumo da compra</h2>
        <p>Total bruto: <strong>R$ {grossTotal.toFixed(2).replace('.', ',')}</strong></p>

        <div>
          <label className="text-sm block mb-1">Usar pontos ({points} disponíveis):</label>
          <input
            type="number"
            value={pointsUsed}
            onChange={(e) => setPointsUsed(Number(e.target.value))}
            className="w-full border px-2 py-1 rounded text-sm"
            min={0}
            max={points}
          />
        </div>

        <Button onClick={calculateDiscount} className="w-full">
          Calcular desconto
        </Button>

        <p>Total com desconto: <strong>R$ {finalTotal.toFixed(2).replace('.', ',')}</strong></p>

        <Button className="w-full" onClick={handleCheckout}>
          Finalizar compra
        </Button>
      </div>

      <CheckoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmPurchase}
        productName={product?.name}
        paymentMethods={paymentMethods}
        
      />
    </div>
  );
};

export default Cart;