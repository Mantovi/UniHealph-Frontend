import {
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '@/api/cart';
import { getPointsBalance } from '@/api/points';
import { checkoutCart } from '@/api/orders';
import { useEffect, useState } from 'react';
import type { CartItemResponse } from '@/types/cart';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import CheckoutModal from '@/components/CheckoutModal';
import { getPaymentMethods } from '@/api/payment';
import type { PaymentMethod } from '@/types/payment';
import type { ProductResponse } from '@/types/product';
import { showApiMessage } from '@/utils/showApiMessage';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

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

        setItems(cartItems.sort((a, b) => a.name.localeCompare(b.name)));
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
      const response = await updateCartItem({ productId, quantity, semesterCount });
      showApiMessage(response, { successMessage: 'Item atualizado!', errorMessage: 'Erro ao atualizar item' });
      if (response.success) {
        fetchCart();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao atualizar item';
      toast.error(message);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const response = await removeCartItem(productId);
      showApiMessage(response, { successMessage: 'Item removido!', errorMessage: 'Erro ao remover item' });
      if (response.success) {
        fetchCart();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao remover item';
      toast.error(message);
    }
  };

    const handleClearCart = async () => {
    if (!window.confirm('Tem certeza que deseja remover todos os itens do carrinho?')) return;

    try {
      const response = await clearCart();
      if (response.success) {
        toast.success('Carrinho limpo com sucesso!');
        setItems([]);
        setSelected([]);
        setGrossTotal(0);
        setFinalTotal(0);
      } else {
        toast.error(response.message || 'Erro ao limpar carrinho');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro ao limpar carrinho';
      toast.error(message);
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
    const response = await checkoutCart(selected, pointsUsed);
    showApiMessage(response, { successMessage: 'Compra realizada com sucesso!', errorMessage: 'Erro ao finalizar compra' });
    setModalOpen(false);
    setItems(prev => prev.filter(item => !selected.includes(item.productId)));
    setSelected([]);
    await fetchCart();
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    const message = axiosError.response?.data?.message ||
      axiosError.message ||
      'Erro ao finalizar compra';
    toast.error(message);
  }
};

  return (
    <div className="max-w-7xl mx-auto py-6 px-2 sm:px-3 md:px-4 grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50 rounded-3xl min-h-screen relative pb-40 md:pb-8 overflow-x-hidden">
      <section className="md:col-span-2 space-y-5 order-2 md:order-1" aria-labelledby="cart-title">
        <h1 id="cart-title" className="text-3xl font-bold mb-4 text-blue-900">Meu Carrinho</h1>

        {items.length === 0 ? (
          <p className="text-gray-600 bg-blue-100 rounded-lg p-6 text-center text-lg font-medium">Seu carrinho está vazio.</p>
        ) : (
          items.map((item) => {
            const image =
              item.imageUrl ??
              'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019';
            const isDisabled = !item.isActive;

            return (
              <Card
                key={item.productId}
                className={`flex flex-row items-start p-4 border w-full bg-white 
                ${isDisabled ? "bg-orange-50 border-orange-300" : "border-blue-200"}
                shadow-sm rounded-xl gap-3 sm:gap-5`}
                aria-disabled={isDisabled}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item.productId)}
                  onChange={() => toggleSelect(item.productId)}
                  className="mt-1 accent-blue-500 shrink-0"
                  disabled={isDisabled}
                  aria-label={`Selecionar ${item.name}`}
                />

                <img
                  src={image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded border"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <h2 className="font-semibold text-base sm:text-lg truncate">{item.name}</h2>
                    <span className="text-sm text-gray-500">Tipo: {item.saleType === 'VENDA' ? 'Venda' : 'Aluguel'}</span>
                  </div>

                  <div className="text-sm text-blue-900 mt-1">
                    Preço unitário: <strong>R$ {item.unitPrice.toFixed(2).replace('.', ',')}</strong>
                  </div>
                  <div className="text-sm">
                    Total: <strong className="font-semibold">R$ {item.totalPrice.toFixed(2).replace('.', ',')}</strong>
                  </div>

                  {isDisabled && (
                    <div className="bg-orange-100 text-orange-700 p-2 rounded mt-2 font-medium flex items-center gap-2 text-sm">
                      <span className="material-icons text-base">error_outline</span>
                      Produto desativado - não pode ser comprado
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 mt-3 items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Qtd:</span>
                      <Button size="sm" onClick={() => updateItem(item.productId, item.quantity - 1, item.semesterCount ?? 1)} disabled={item.quantity <= 1 || isDisabled} variant="outline">-</Button>
                      <span>{item.quantity}</span>
                      <Button size="sm" onClick={() => updateItem(item.productId, item.quantity + 1, item.semesterCount ?? 1)} disabled={isDisabled} variant="outline">+</Button>
                    </div>

                    {item.saleType === 'ALUGUEL' && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Semestres:</span>
                        <Button size="sm" onClick={() => updateItem(item.productId, item.quantity, (item.semesterCount ?? 1) - 1)} disabled={(item.semesterCount ?? 1) <= 1 || isDisabled} variant="outline">-</Button>
                        <span>{item.semesterCount ?? 1}</span>
                        <Button size="sm" onClick={() => updateItem(item.productId, item.quantity, (item.semesterCount ?? 1) + 1)} disabled={isDisabled} variant="outline">+</Button>
                      </div>
                    )}

                    <Button variant="destructive" size="sm" onClick={() => removeItem(item.productId)}>Excluir</Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </section>

      <aside className="order-1 md:order-2 hidden md:block">
        <Card className="space-y-5 p-5 bg-white shadow-xl rounded-xl sticky top-8 w-full max-w-xs">
          <h2 className="text-xl font-semibold text-blue-900">Resumo da compra</h2>

          <p className="text-base">Total bruto: <strong>R$ {grossTotal.toFixed(2).replace('.', ',')}</strong></p>

          <div>
            <label className="text-sm font-medium text-blue-900 mb-1 block">Usar pontos ({points} disponíveis):</label>
            <Input type="number" value={pointsUsed} onChange={(e) => setPointsUsed(Number(e.target.value))} className="w-full text-sm" min={0} max={points} />
          </div>

          <Button onClick={calculateDiscount} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Calcular desconto</Button>

          <p className="text-base">Total com desconto: <strong>R$ {finalTotal.toFixed(2).replace('.', ',')}</strong></p>

          <Button onClick={handleCheckout} className="w-full bg-emerald-600 hover:bg-green-700 text-white text-base font-semibold">Finalizar compra</Button>

          <Button variant="outline" className="w-full border-orange-500 text-orange-500 mt-2" onClick={handleClearCart} type="button">Limpar carrinho</Button>
        </Card>
      </aside>

      <footer className="fixed bottom-0 left-0 w-full z-30 bg-white shadow-2xl border-t border-blue-100 p-4 md:hidden">
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          <div className="flex justify-between text-sm font-medium text-blue-900">
            <span>Produtos:</span>
            <span>R$ {grossTotal.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label htmlFor="mobilePointsInput" className="text-blue-900">Pontos:</label>
            <Input id="mobilePointsInput" type="number" value={pointsUsed} onChange={(e) => setPointsUsed(Number(e.target.value))} className="w-20" min={0} max={points} />
            <span className="text-gray-500 ml-2">{points} disp.</span>
          </div>

          <div className="flex justify-between text-sm font-semibold">
            <span>Total:</span>
            <span className="text-blue-900">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="flex flex-col gap-2">
            <Button size="sm" className="w-full bg-emerald-600 hover:bg-green-700 text-white">Finalizar compra</Button>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={calculateDiscount}>Calcular desconto</Button>
            <Button size="sm" variant="outline" className="w-full border-orange-500 text-orange-500" onClick={handleClearCart}>Limpar carrinho</Button>
          </div>
        </div>
      </footer>

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