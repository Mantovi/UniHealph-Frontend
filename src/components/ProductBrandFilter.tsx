import { useEffect, useState } from 'react';
import { getAllBrands } from '@/api/products';
import type { Brand } from '@/types/brand';

interface Props {
  selectedBrandIds: number[];
  onToggleBrand: (id: number) => void;
}

const ProductBrandFilter = ({ selectedBrandIds, onToggleBrand }: Props) => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    getAllBrands()
      .then(setBrands)
      .catch(() => console.error('Erro ao carregar marcas'));
  }, []);

  return (
    <div className="space-y-2 text-sm">
      <h3 className="font-semibold">Marcas</h3>
      {brands.map((brand) => (
        <div key={brand.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`brand-${brand.id}`}
            checked={selectedBrandIds.includes(brand.id)}
            onChange={() => onToggleBrand(brand.id)}
          />
          <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
        </div>
      ))}
    </div>
  );
};

export default ProductBrandFilter;
