import { useState } from 'react';
import { Plan } from '@/types/plan';

interface Props {
  initialData?: Partial<Plan>;
  onSubmit: (data: Omit<Plan, 'id'>) => void;
  onCancel?: () => void;
}

const PlanForm = ({ initialData = {}, onSubmit, onCancel }: Props) => {
  const [form, setForm] = useState<Omit<Plan, 'id'>>({
    name: initialData.name || '',
    maxStudents: initialData.maxStudents || 0,
    priceMonthly: initialData.priceMonthly || 0,
    priceYearly: initialData.priceYearly || 0,
    description: initialData.description || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes('price') || name === 'maxStudents'
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="input-label">Nome do Plano:</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nome do plano"
          required
          className="input"
        />
      </div>

      <div>
        <label className="input-label">Máximo de Alunos:</label>
        <input
          name="maxStudents"
          type="number"
          value={form.maxStudents}
          onChange={handleChange}
          placeholder="Máximo de alunos"
          className="input"
        />
      </div>

      <div>
        <label className="input-label">Preço Mensal:</label>
        <input
          name="priceMonthly"
          type="number"
          value={form.priceMonthly}
          onChange={handleChange}
          placeholder="Preço mensal"
          className="input"
        />
      </div>

      <div>
        <label className="input-label">Preço Anual:</label>
        <input
          name="priceYearly"
          type="number"
          value={form.priceYearly}
          onChange={handleChange}
          placeholder="Preço anual"
          className="input"
        />
      </div>

      <div>
        <label className="input-label">Descrição:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descrição"
          className="input"
        />
      </div>

      <div className="flex gap-4">
        <button type="submit" className="btn-primary">
          Salvar
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default PlanForm;
