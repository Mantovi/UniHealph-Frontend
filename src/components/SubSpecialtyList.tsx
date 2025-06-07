import { SubSpecialtyBasic } from '@/types/specialty';

interface Props {
  subs: SubSpecialtyBasic[];
  onSelect: (sub: SubSpecialtyBasic) => void;
  onBack: () => void;
}

const SubSpecialtyList = ({ subs, onSelect, onBack }: Props) => {
  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">← Voltar para especialidades</button>
      <div className="grid grid-cols-2 gap-4">
        {subs.map((sub) => (
          <div
            key={sub.id}
            className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(sub)}
          >
            <h4 className="font-semibold">{sub.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubSpecialtyList;
