import { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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
      <DialogContent className="max-w-lg w-full">
        <DialogTitle>{initialData ? 'Editar plano' : 'Criar novo plano'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="plan-name">Nome</Label>
            <Input id="plan-name" {...register('name')} autoFocus />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="plan-max-students">Máximo de estudantes</Label>
            <Input
              id="plan-max-students"
              type="number"
              min={1}
              {...register('maxStudents', { valueAsNumber: true })}
            />
            {errors.maxStudents && <p className="text-sm text-red-600">{errors.maxStudents.message}</p>}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="plan-price-monthly">Preço mensal</Label>
              <Input
                id="plan-price-monthly"
                type="number"
                min={0}
                step="0.01"
                {...register('priceMonthly', { valueAsNumber: true })}
              />
              {errors.priceMonthly && <p className="text-sm text-red-600">{errors.priceMonthly.message}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="plan-price-yearly">Preço anual</Label>
              <Input
                id="plan-price-yearly"
                type="number"
                min={0}
                step="0.01"
                {...register('priceYearly', { valueAsNumber: true })}
              />
              {errors.priceYearly && <p className="text-sm text-red-600">{errors.priceYearly.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="plan-description">Descrição</Label>
            <Textarea id="plan-description" rows={3} {...register('description')} />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? 'Salvando...'
              : initialData
              ? 'Salvar alterações'
              : 'Criar plano'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanModal;
