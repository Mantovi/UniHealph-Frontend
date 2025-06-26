import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { PaymentMethodRequest } from '@/types/payment';

const schema = z.object({
  type: z.string().min(1, 'Tipo obrigatório'),
  description: z.string().min(1, 'Descrição obrigatória'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentMethodRequest) => Promise<void>;
  initialData?: PaymentMethodRequest | null;
  loading?: boolean;
}

const PaymentMethodModal = ({ open, onClose, onSubmit, initialData, loading }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Método de pagamento</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-semibold">{initialData ? 'Editar método' : 'Novo método de pagamento'}</h2>

          <div>
            <Label>Tipo</Label>
            <Input {...register('type')} />
            {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
          </div>

          <div>
            <Label>Descrição</Label>
            <Input {...register('description')} />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar método'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodModal;