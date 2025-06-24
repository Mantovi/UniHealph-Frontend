import type { FunctionComponent } from 'react';

interface Props {
  sortBy: string;
  direction: 'asc' | 'desc';
  onChange: (sortBy: string, direction: 'asc' | 'desc') => void;
}

const ProductSortMenu: FunctionComponent<Props> = ({ sortBy, direction, onChange }) => {
  return (
    <div className="flex items-center gap-2 justify-end">
      <label className="text-sm font-medium">Ordenar por:</label>
      <select
        value={`${sortBy}-${direction}`}
        onChange={(e) => {
          const [field, dir] = e.target.value.split('-');
          onChange(field, dir as 'asc' | 'desc');
        }}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="price-asc">Preço: menor → maior</option>
        <option value="price-desc">Preço: maior → menor</option>
        <option value="averageRating-desc">Melhor avaliado</option>
        <option value="quantitySold-desc">Mais vendidos</option>
      </select>
    </div>
  );
};

export default ProductSortMenu; 
