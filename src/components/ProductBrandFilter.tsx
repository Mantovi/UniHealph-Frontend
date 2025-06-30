import { useEffect, useState } from 'react';
import { getAllBrands } from '@/api/products';
import type { Brand } from '@/types/brand';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Props {
  selectedBrandIds: number[];
  onToggleBrand: (id: number) => void;
}

const ProductBrandFilter = ({ selectedBrandIds, onToggleBrand }: Props) => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    getAllBrands()
      .then(setBrands)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4 text-sm">
      <h3 className="font-semibold text-blue-900 text-base">Marcas</h3>

      <div className="max-h-[300px] overflow-y-auto pr-2 custom-scroll space-y-2">
        {brands.map((brand) => (
          <div key={brand.id} className="flex items-center gap-2">
            <Checkbox
              id={`brand-${brand.id}`}
              checked={selectedBrandIds.includes(brand.id)}
              onCheckedChange={() => onToggleBrand(brand.id)}
            />
            <Label htmlFor={`brand-${brand.id}`}>{brand.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductBrandFilter;