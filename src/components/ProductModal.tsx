import { Dialog, DialogContent } from '@/components/ui/dialog';
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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Editar Produto' : 'Novo Produto'}
          </h2>

          <div>
            <Label>Nome</Label>
            <Input className="w-full" {...register('name')} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              className="w-full whitespace-pre-wrap resize-y max-h-40"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Preço</Label>
              <Input type="number" step="0.01" {...register('price')} />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <Label>Estoque mínimo</Label>
              <Input type="number" {...register('stockThreshold')} />
              {errors.stockThreshold && (
                <p className="text-red-500 text-sm">{errors.stockThreshold.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de venda</Label>
              <select {...register('saleType')} className="w-full border rounded px-2 py-1">
                <option value="VENDA">VENDA</option>
                <option value="ALUGUEL">ALUGUEL</option>
              </select>
            </div>
            <div>
              <Label>Estoque inicial</Label>
              <Input type="number" {...register('initialStock')} />
              {errors.initialStock && (
                <p className="text-red-500 text-sm">{errors.initialStock.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Marca</Label>
            <select
              {...register('brandId')}
              className="w-full border rounded px-2 py-1 max-h-40 overflow-y-auto"
              size={4}
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
              className="w-full border rounded px-2 py-1 max-h-40 overflow-y-auto"
              size={4}
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
                  className="w-full whitespace-pre-wrap resize-y max-h-40"
                  value={field.value.join('\n')}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(Boolean)
                    )
                  }
                />
              )}
            />
            {errors.imageUrls && (
              <p className="text-sm text-red-500">{errors.imageUrls.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar Produto'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;