import {type FunctionComponent, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string) => void;
  productName?: string;
}

const paymentOptions = ['PIX', 'Cartão de Crédito', 'Boleto'];

const CheckoutModal: FunctionComponent<Props> = ({ open, onClose, onConfirm, productName }) => {
  const [selected, setSelected] = useState<string | null>(null);

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
          {paymentOptions.map((option) => (
            <label
              key={option}
              className={`flex items-center gap-2 cursor-pointer p-2 rounded border ${
                selected === option ? 'border-primary' : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
              />
              <span>{option}</span>
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
