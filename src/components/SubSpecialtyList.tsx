import { FC } from 'react';
import { SubSpecialtyBasic } from '@/types/categoryHierarchy';

interface Props {
  subSpecialties: SubSpecialtyBasic[];
  onSelect: (sub: SubSpecialtyBasic) => void;
  title: string;
}

const SubSpecialtyList: FC<Props> = ({ subSpecialties, onSelect, title }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Subespecialidades de {title}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subSpecialties.map((sub) => (
          <li
            key={sub.id}
            onClick={() => onSelect(sub)}
            className="cursor-pointer p-4 border rounded hover:bg-green-50 transition"
          >
            <h4 className="text-md font-medium">{sub.name}</h4>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubSpecialtyList;
