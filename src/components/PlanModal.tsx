import { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PlanRequest } from '@/types/plan';

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  maxStudents: z.number().min(1, 'Informe um limite válido'),
  priceMonthly: z.number().min(0),
  priceYearly: z.number().min(0),
  description: z.string().min(1, 'Descrição obrigatória'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PlanRequest) => Promise<void>;
  initialData?: PlanRequest | null;
  loading?: boolean;
}

const PlanModal = ({ open, onClose, onSubmit, initialData, loading }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      maxStudents: 1,
      priceMonthly: 0,
      priceYearly: 0,
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-semibold">{initialData ? 'Editar plano' : 'Criar novo plano'}</h2>

          <div>
            <Label>Nome</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Máximo de estudantes</Label>
            <Input type="number" {...register('maxStudents', { valueAsNumber: true })} />
            {errors.maxStudents && <p className="text-sm text-red-600">{errors.maxStudents.message}</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Preço mensal</Label>
              <Input type="number" step="0.01" {...register('priceMonthly', { valueAsNumber: true })} />
              {errors.priceMonthly && <p className="text-sm text-red-600">{errors.priceMonthly.message}</p>}
            </div>
            <div className="flex-1">
              <Label>Preço anual</Label>
              <Input type="number" step="0.01" {...register('priceYearly', { valueAsNumber: true })} />
              {errors.priceYearly && <p className="text-sm text-red-600">{errors.priceYearly.message}</p>}
            </div>
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea {...register('description')} />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar plano'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanModal;