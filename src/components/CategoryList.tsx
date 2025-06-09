import { FC } from 'react';
import { CategoryBasic } from '@/types/categoryHierarchy';

interface Props {
  categories: CategoryBasic[];
  onSelect: (categoryId: number) => void;
}

const CategoryList: FC<Props> = ({ categories, onSelect }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Categorias</h3>
      {categories.length === 0 ? (
        <p className="text-gray-500">Nenhuma categoria vinculada.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => onSelect(category.id)}
              className="cursor-pointer p-4 border rounded hover:bg-yellow-50 transition shadow-sm"
            >
              <h4 className="text-md font-medium">{category.name}</h4>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
