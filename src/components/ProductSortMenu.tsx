'use client';

import type { FunctionComponent } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  sortBy: string;
  direction: 'asc' | 'desc';
  onChange: (sortBy: string, direction: 'asc' | 'desc') => void;
}

const ProductSortMenu: FunctionComponent<Props> = ({ sortBy, direction, onChange }) => {
  return (
    <div className="flex items-center gap-2 justify-end text-sm">
      <label className="font-medium text-blue-900">Ordenar por:</label>

      <Select
        value={`${sortBy}-${direction}`}
        onValueChange={(value) => {
          const [field, dir] = value.split('-');
          onChange(field, dir as 'asc' | 'desc');
        }}
      >
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Ordenar por..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Preço: menor → maior</SelectItem>
          <SelectItem value="price-desc">Preço: maior → menor</SelectItem>
          <SelectItem value="averageRating-desc">Melhor avaliado</SelectItem>
          <SelectItem value="quantitySold-desc">Mais vendidos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSortMenu;