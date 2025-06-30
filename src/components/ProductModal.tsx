import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from './ui/textarea';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().min(1, 'Descrição obrigatória'),
  price: z.coerce.number().min(0.01, 'Preço inválido'),
  stockThreshold: z.coerce.number().min(1, 'Estoque mínimo deve ser maior que zero'),
  saleType: z.enum(['VENDA', 'ALUGUEL']),
  brandId: z.coerce.number().int().positive(),
  productTypeId: z.coerce.number().int().positive(),
  initialStock: z.coerce.number().min(0),
  imageUrls: z
    .array(z.string().url({ message: 'URL inválida' }))
    .min(1, 'Informe ao menos 1 imagem'),
});

export type ProductFormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  initialData?: ProductFormValues | null;
  loading?: boolean;
  brands: { id: number; name: string }[];
  productTypes: { id: number; name: string }[];
}

const ProductModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
  brands,
  productTypes,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stockThreshold: 1,
      saleType: 'VENDA',
      brandId: brands[0]?.id || 1,
      productTypeId: productTypes[0]?.id || 1,
      initialStock: 0,
      imageUrls: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full max-h-[90vh] overflow-y-auto px-2 py-2 text-sm">
        <DialogTitle className="text-base sm:text-lg">{initialData ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label>Nome</Label>
            <Input className="w-full" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              className="w-full whitespace-pre-wrap resize-y max-h-32"
              {...register('description')}
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label>Preço</Label>
              <Input type="number" step="0.01" {...register('price')} />
              {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
            </div>
            <div className="flex-1">
              <Label>Estoque mínimo</Label>
              <Input type="number" {...register('stockThreshold')} />
              {errors.stockThreshold && (
                <p className="text-xs text-red-500">{errors.stockThreshold.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label>Tipo de venda</Label>
              <select {...register('saleType')} className="w-full border rounded px-2 py-1">
                <option value="VENDA">VENDA</option>
                <option value="ALUGUEL">ALUGUEL</option>
              </select>
            </div>
            <div className="flex-1">
              <Label>Estoque inicial</Label>
              <Input type="number" {...register('initialStock')} />
              {errors.initialStock && (
                <p className="text-xs text-red-500">{errors.initialStock.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Marca</Label>
            <select
              {...register('brandId')}
              className="w-full border rounded px-2 py-1"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Tipo de produto</Label>
            <select
              {...register('productTypeId')}
              className="w-full border rounded px-2 py-1"
            >
              {productTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Imagens (URLs separadas por linha)</Label>
            <Controller
              name="imageUrls"
              control={control}
              render={({ field }) => (
                <Textarea
                  className="w-full min-h-[60px] max-h-32 resize-y text-sm break-all"
                  wrap="hard"
                  value={field.value.join('\n')}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(/[\s\n]+/)
                        .map((line) => line.trim())
                        .filter(Boolean)
                    )
                  }
                  rows={2}
                  placeholder="https://..."
                />
              )}
            />
            {errors.imageUrls && (
              <p className="text-xs text-red-500">{errors.imageUrls.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full text-sm h-9">
            {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar Produto'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;