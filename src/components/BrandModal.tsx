import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { BrandRequest } from '@/types/brand';

const schema = z.object({
  name: z.string().min(1, 'Nome da marca é obrigatório'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BrandRequest) => Promise<void>;
  initialData?: BrandRequest | null;
  loading?: boolean;
}

const BrandModal = ({ open, onClose, onSubmit, initialData, loading }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ name: '' });
    }
  }, [initialData, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Editar Marca' : 'Nova Marca'}
          </h2>
          <div>
            <Label htmlFor="brand-name">Nome</Label>
            <Input
              id="brand-name"
              {...register('name')}
              autoFocus
              placeholder="Digite o nome da marca"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? 'Salvando...'
              : initialData
                ? 'Salvar alterações'
                : 'Criar marca'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BrandModal;