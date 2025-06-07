import { Specialty } from '@/types/specialty';

interface Props {
  specialties: Specialty[];
  onSelect: (specialty: Specialty) => void;
}

const SpecialtyList = ({ specialties, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {specialties.map((spec) => (
        <div
          key={spec.id}
          className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(spec)}
        >
          <h3 className="font-bold text-lg">{spec.name}</h3>
          <p className="text-sm text-gray-600">{spec.subSpecialties.length} subespecialidades</p>
        </div>
      ))}
    </div>
  );
};

export default SpecialtyList;
