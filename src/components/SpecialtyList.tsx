import { FC } from 'react';
import { Specialty } from '@/types/categoryHierarchy';

interface Props {
  specialties: Specialty[];
  onSelect: (subSpecialties: Specialty['subSpecialties'], name: string) => void;
}

const SpecialtyList: FC<Props> = ({ specialties, onSelect }) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {specialties.map((spec) => (
        <li
          key={spec.id}
          onClick={() => onSelect(spec.subSpecialties, spec.name)}
          className="cursor-pointer p-4 border rounded hover:bg-blue-50 transition"
        >
          <h3 className="text-lg font-bold">{spec.name}</h3>
        </li>
      ))}
    </ul>
  );
};

export default SpecialtyList;
