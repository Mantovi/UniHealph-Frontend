import { PaymentMethod } from '@/types/paymentMethod';
import { useState } from 'react';

interface Props {
  initialData?: Partial<PaymentMethod>;
  onSubmit: (data: Omit<PaymentMethod, 'id'>) => void;
  onCancel?: () => void;
}

const PaymentMethodForm = ({ initialData = {}, onSubmit, onCancel }: Props) => {
  const [form, setForm] = useState<Omit<PaymentMethod, 'id'>>({
    type: initialData.type || '',
    description: initialData.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="input-label">Tipo:</label>
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Ex: Cartão de Crédito"
          required
          className="input"
        />
      </div>

      <div>
        <label className="input-label">Descrição:</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descrição do método"
          required
          className="input"
        />
      </div>

      <div className="flex gap-4">
        <button type="submit" className="btn-primary">Salvar</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        )}
      </div>
    </form>
  );
};

export default PaymentMethodForm;
