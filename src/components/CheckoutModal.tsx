import { type FunctionComponent, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { PaymentMethod } from '@/types/payment';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: PaymentMethod) => void;
  productName?: string;
  paymentMethods: PaymentMethod[];
}

const CheckoutModal: FunctionComponent<Props> = ({ open, onClose, onConfirm, productName, paymentMethods }) => {
  const [selected, setSelected] = useState<PaymentMethod | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onConfirm(selected);
      setSelected(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar Compra</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mb-4">
          Selecione a forma de pagamento para o produto <strong>{productName}</strong>
        </p>
        <div className="space-y-2">
          {paymentMethods.map((option) => (
            <label
              key={option.id}
              className={`flex items-center gap-2 cursor-pointer p-2 rounded border ${
                selected?.id === option.id ? 'border-primary' : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={option.id}
                checked={selected?.id === option.id}
                onChange={() => setSelected(option)}
              />
              <span>{option.type}</span>
              {option.description && <span className="text-xs text-gray-500 ml-2">{option.description}</span>}
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleConfirm} disabled={!selected}>
            Finalizar compra
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;