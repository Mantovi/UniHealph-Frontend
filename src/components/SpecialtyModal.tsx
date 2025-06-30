import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { SpecialtyRequest } from '@/types/specialty';

const schema = z.object({
  name: z.string().min(1, 'Nome da especialidade é obrigatório'),
  active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SpecialtyRequest) => Promise<void>;
  initialData?: SpecialtyRequest | null;
  loading?: boolean;
}

const SpecialtyModal = ({ open, onClose, onSubmit, initialData, loading }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      active: true,
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
          <h2 className="text-xl font-semibold">
            {initialData ? 'Editar Especialidade' : 'Nova Especialidade'}
          </h2>
          <div>
            <Label>Nome</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <Label className="flex items-center gap-2">
              <input type="checkbox" {...register('active')} className="accent-green-600" />
              Especialidade ativa
            </Label>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar Especialidade'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialtyModal;