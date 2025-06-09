import { FC } from 'react';
import { ProductTypeBasic } from '@/types/categoryHierarchy';

interface Props {
  productTypes: ProductTypeBasic[];
}

const ProductTypeList: FC<Props> = ({ productTypes }) => {
  return (
    <div className="mt-6">
      <h4 className="text-xl font-semibold mb-2">Tipos de Produto</h4>
      {productTypes.length === 0 ? (
        <p className="text-gray-500">Nenhum tipo de produto encontrado.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productTypes.map((pt) => (
            <li
              key={pt.id}
              className="p-4 border rounded shadow-sm  hover:bg-blue-700 hover:text-white cursor-pointer transition"
            >
              <h4 className="text-md font-medium">{pt.name}</h4>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductTypeList;
