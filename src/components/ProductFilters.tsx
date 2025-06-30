import type { FunctionComponent } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Props {
  selectedSaleTypes: string[];
  onToggleSaleType: (type: string) => void;
}

const saleTypes = ['VENDA', 'ALUGUEL'];

const ProductFilters: FunctionComponent<Props> = ({ selectedSaleTypes, onToggleSaleType }) => {
  return (
    <div className="space-y-4 text-sm">
      <h3 className="font-semibold text-blue-900 text-base">Tipo de Venda</h3>

      <ul className="space-y-2">
        {saleTypes.map((type) => {
          const isChecked = selectedSaleTypes.includes(type);
          return (
            <li key={type} className="flex items-center gap-2 pl-1">
              <Checkbox
                id={`sale-${type}`}
                checked={isChecked}
                onCheckedChange={() => onToggleSaleType(type)}
              />
              <Label htmlFor={`sale-${type}`}>
                {type === 'VENDA' ? 'Venda' : 'Aluguel'}
              </Label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProductFilters;