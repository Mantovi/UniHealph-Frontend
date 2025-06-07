import { useEffect, useState } from 'react';
import { PaymentMethod } from '@/types/paymentMethod';
import { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod} from '@/api/paymentMethodApi';
import PaymentMethodForm from '@/components/PaymentMethodForm';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PaymentMethods = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [open, setOpen] = useState(false);

  const loadMethods = async () => {
    const data = await getPaymentMethods();
    setMethods(data);
  };

  useEffect(() => {
    loadMethods();
  }, []);

  const handleCreate = async (data: Omit<PaymentMethod, 'id'>) => {
    await createPaymentMethod(data);
    setCreating(false);
    setOpen(false);
    await loadMethods();
  };

  const handleUpdate = async (data: Omit<PaymentMethod, 'id'>) => {
    if (!editing) return;
    await updatePaymentMethod(editing.id, data);
    setEditing(null);
    setOpen(false);
    await loadMethods();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente remover este método de pagamento?')) {
      await deletePaymentMethod(id);
      await loadMethods();
    }
  };

  const openCreateModal = () => {
    setCreating(true);
    setEditing(null);
    setOpen(true);
  };

  const openEditModal = (method: PaymentMethod) => {
    setEditing(method);
    setCreating(false);
    setOpen(true);
  };

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
    setOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Métodos de Pagamento</h2>

      <button onClick={openCreateModal} className="btn-primary mb-4">
        Criar novo método
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{creating ? 'Novo Método' : 'Editar Método'}</DialogTitle>
          </DialogHeader>
          <PaymentMethodForm
            initialData={editing ?? {}}
            onSubmit={creating ? handleCreate : handleUpdate}
            onCancel={closeModal}
          />
        </DialogContent>
      </Dialog>

      <ul className="space-y-4">
        {methods.map((method) => (
          <li key={method.id} className="border p-4 rounded shadow-sm flex justify-between items-start">
            <div>
              <h4 className="text-lg font-semibold">{method.type}</h4>
              <p className="text-gray-600 text-sm">{method.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEditModal(method)} className="btn-secondary">Editar</button>
              <button onClick={() => handleDelete(method.id)} className="btn-danger">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMethods;
