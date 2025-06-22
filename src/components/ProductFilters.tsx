import type { FunctionComponent } from 'react';

interface Props {
  selectedSaleTypes: string[];
  onToggleSaleType: (type: string) => void;
}

const saleTypes = ['VENDA', 'ALUGUEL'];

const ProductFilters: FunctionComponent<Props> = ({ selectedSaleTypes, onToggleSaleType }) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">Tipo de Venda</h3>
      <ul className="space-y-1 text-sm">
        {saleTypes.map((type) => {
          const isChecked = selectedSaleTypes.includes(type);
          return (
            <li key={type} className="flex items-center gap-2 pl-1">
              <input
                type="checkbox"
                id={`sale-${type}`}
                checked={isChecked}
                onChange={() => onToggleSaleType(type)}
                aria-checked={isChecked}
              />
              <label htmlFor={`sale-${type}`}>
                {type === 'VENDA' ? 'Venda' : 'Aluguel'}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProductFilters;
