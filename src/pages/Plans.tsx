import { useEffect, useState } from 'react';
import { Plan } from '@/types/plan';
import { getPlans, createPlan, updatePlan, deletePlan } from '@/api/planApi';
import PlanForm from '@/components/PlanForm';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);

  const loadPlans = async () => {
    const data = await getPlans();
    setPlans(data);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleCreate = async (data: Omit<Plan, 'id'>) => {
    await createPlan(data);
    setCreating(false);
    setOpen(false);
    await loadPlans();
  };

  const handleUpdate = async (data: Omit<Plan, 'id'>) => {
    if (!editing) return;
    await updatePlan(editing.id, data);
    setEditing(null);
    setOpen(false);
    await loadPlans();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente remover este plano?')) {
      await deletePlan(id);
      await loadPlans();
    }
  };

  const openCreateModal = () => {
    setCreating(true);
    setEditing(null);
    setOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditing(plan);
    setCreating(false);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setCreating(false);
    setEditing(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Planos</h2>

      <button onClick={openCreateModal} className="btn-primary mb-4">
        Criar novo plano
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{creating ? 'Novo Plano' : 'Editar Plano'}</DialogTitle>
          </DialogHeader>
          <PlanForm
            initialData={editing ?? {}}
            onSubmit={creating ? handleCreate : handleUpdate}
            onCancel={closeModal}
          />
        </DialogContent>
      </Dialog>

      <ul className="space-y-4">
        {plans.map((plan) => (
          <li key={plan.id} className="border p-4 rounded shadow-sm flex justify-between items-start">
            <div>
              <h4 className="text-lg font-semibold">{plan.name}</h4>
              <p>Máx alunos: {plan.maxStudents}</p>
              <p>Mensal: R$ {plan.priceMonthly}</p>
              <p>Anual: R$ {plan.priceYearly}</p>
              <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEditModal(plan)} className="btn-secondary">Editar</button>
              <button onClick={() => handleDelete(plan.id)} className="btn-danger">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Plans;
